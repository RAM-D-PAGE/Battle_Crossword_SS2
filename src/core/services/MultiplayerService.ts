import { supabase, Room, Player, GameAction } from './SupabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════════
// Multiplayer Service — Room Management & Realtime
// ═══════════════════════════════════════════════════

// Generate a simple player ID (persisted in localStorage)
function getPlayerId(): string {
    let id = localStorage.getItem('bcw-player-id');
    if (!id) {
        id = 'p_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
        localStorage.setItem('bcw-player-id', id);
    }
    return id;
}

function getPlayerName(): string {
    return localStorage.getItem('bcw-player-name') || `Player_${Math.floor(Math.random() * 9999)}`;
}

export function setPlayerName(name: string): void {
    localStorage.setItem('bcw-player-name', name);
}

// ═══════════════════════════════════════════════════
// Room CRUD
// ═══════════════════════════════════════════════════

export async function createRoom(name: string, maxPlayers: number = 2, isPrivate: boolean = false): Promise<Room | null> {
    const playerId = getPlayerId();
    const playerName = getPlayerName();

    const { data, error } = await supabase
        .from('rooms')
        .insert({
            name,
            host_id: playerId,
            host_name: playerName,
            max_players: maxPlayers,
            status: 'waiting',
            is_private: isPrivate
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating room:', error);
        return null;
    }

    // Auto-join as host
    await joinRoom(data.id);
    return data;
}

export async function fetchRooms(): Promise<Room[]> {
    const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .in('status', ['waiting', 'playing'])
        .eq('is_private', false)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error('Error fetching rooms:', error);
        return [];
    }
    return data || [];
}

export async function joinRoom(roomId: string): Promise<Player | null> {
    const playerId = getPlayerId();
    const playerName = getPlayerName();

    // Check if already in room
    const { data: existing } = await supabase
        .from('players')
        .select('*')
        .eq('room_id', roomId)
        .eq('player_id', playerId)
        .maybeSingle();

    if (existing) return existing;

    // Check room capacity
    const { data: room } = await supabase
        .from('rooms')
        .select('*, players:players(count)')
        .eq('id', roomId)
        .single();

    if (!room || room.status !== 'waiting') return null;

    const { data, error } = await supabase
        .from('players')
        .insert({
            room_id: roomId,
            player_id: playerId,
            player_name: playerName,
            player_class: 'scribe',
            hp: 100,
            max_hp: 100,
            score: 0,
            is_ready: false,
            is_host: room.host_id === playerId
        })
        .select()
        .single();

    if (error) {
        console.error('Error joining room:', error);
        return null;
    }
    return data;
}

export async function leaveRoom(roomId: string): Promise<void> {
    const playerId = getPlayerId();

    await supabase
        .from('players')
        .delete()
        .eq('room_id', roomId)
        .eq('player_id', playerId);

    // If host leaves, delete the room
    const { data: room } = await supabase
        .from('rooms')
        .select('host_id')
        .eq('id', roomId)
        .single();

    if (room?.host_id === playerId) {
        await supabase.from('players').delete().eq('room_id', roomId);
        await supabase.from('rooms').delete().eq('id', roomId);
    }
}

export async function getPlayersInRoom(roomId: string): Promise<Player[]> {
    const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

    if (error) return [];
    return data || [];
}

export async function setReady(roomId: string, ready: boolean): Promise<void> {
    const playerId = getPlayerId();
    await supabase
        .from('players')
        .update({ is_ready: ready })
        .eq('room_id', roomId)
        .eq('player_id', playerId);
}

export async function startGame(roomId: string): Promise<void> {
    await supabase
        .from('rooms')
        .update({ status: 'playing' })
        .eq('id', roomId);
}

// ═══════════════════════════════════════════════════
// Game Actions (Turn Sync)
// ═══════════════════════════════════════════════════

export async function sendAction(
    roomId: string,
    actionType: GameAction['action_type'],
    payload: Record<string, any>
): Promise<void> {
    const playerId = getPlayerId();

    await supabase
        .from('game_actions')
        .insert({
            room_id: roomId,
            player_id: playerId,
            action_type: actionType,
            payload
        });
}

export async function submitWord(roomId: string, word: string, damage: number, score: number): Promise<void> {
    await sendAction(roomId, 'word_submit', { word, damage, score });
}

export async function sendDamage(roomId: string, targetId: string, amount: number): Promise<void> {
    await sendAction(roomId, 'damage', { target_id: targetId, amount });
}

export async function updatePlayerHp(roomId: string, hp: number, score: number): Promise<void> {
    const playerId = getPlayerId();
    await supabase
        .from('players')
        .update({ hp, score })
        .eq('room_id', roomId)
        .eq('player_id', playerId);
}

// ═══════════════════════════════════════════════════
// Realtime Subscriptions
// ═══════════════════════════════════════════════════

export function subscribeToRoom(
    roomId: string,
    callbacks: {
        onPlayerJoin?: (player: Player) => void;
        onPlayerLeave?: (player: Player) => void;
        onPlayerUpdate?: (player: Player) => void;
        onRoomUpdate?: (room: Room) => void;
        onAction?: (action: GameAction) => void;
    }
): RealtimeChannel {
    const channel = supabase
        .channel(`room:${roomId}`)
        .on('postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'players', filter: `room_id=eq.${roomId}` },
            (payload) => callbacks.onPlayerJoin?.(payload.new as Player)
        )
        .on('postgres_changes',
            { event: 'DELETE', schema: 'public', table: 'players', filter: `room_id=eq.${roomId}` },
            (payload) => callbacks.onPlayerLeave?.(payload.old as Player)
        )
        .on('postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'players', filter: `room_id=eq.${roomId}` },
            (payload) => callbacks.onPlayerUpdate?.(payload.new as Player)
        )
        .on('postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
            (payload) => callbacks.onRoomUpdate?.(payload.new as Room)
        )
        .on('postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'game_actions', filter: `room_id=eq.${roomId}` },
            (payload) => callbacks.onAction?.(payload.new as GameAction)
        )
        .subscribe();

    return channel;
}

export function subscribeToRoomList(
    onUpdate: (rooms: Room[]) => void
): RealtimeChannel {
    const channel = supabase
        .channel('room-list')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'rooms' },
            async () => {
                const rooms = await fetchRooms();
                onUpdate(rooms);
            }
        )
        .subscribe();

    return channel;
}

export function unsubscribe(channel: RealtimeChannel): void {
    supabase.removeChannel(channel);
}

// Export player ID getter
export { getPlayerId, getPlayerName };
