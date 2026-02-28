import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Plus, LogIn, Globe, Lock, Wifi, Crown, Swords, RefreshCw } from 'lucide-react';
import { t } from '../../core/i18n';
import {
    createRoom, fetchRooms, joinRoom, leaveRoom,
    getPlayersInRoom, setReady, startGame, setPlayerName,
    getPlayerName, subscribeToRoom, subscribeToRoomList, unsubscribe
} from '../../core/services/MultiplayerService';
import { Room, Player } from '../../core/services/SupabaseClient';

interface MultiplayerLobbyProps {
    onBack: () => void;
}

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ onBack }) => {
    const [tab, setTab] = useState<'rooms' | 'create' | 'lobby'>('rooms');
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [playerName, setName] = useState(getPlayerName());

    // Create room state
    const [roomName, setRoomName] = useState('');
    const [maxPlayers, setMaxPlayers] = useState(2);
    const [isPrivate, setIsPrivate] = useState(false);

    // Load rooms on mount
    useEffect(() => {
        loadRooms();
        const channel = subscribeToRoomList((updatedRooms) => {
            setRooms(updatedRooms);
        });
        return () => unsubscribe(channel);
    }, []);

    // Subscribe to current room
    useEffect(() => {
        if (!currentRoom) return;

        loadPlayers(currentRoom.id);
        const channel = subscribeToRoom(currentRoom.id, {
            onPlayerJoin: () => loadPlayers(currentRoom.id),
            onPlayerLeave: () => loadPlayers(currentRoom.id),
            onPlayerUpdate: () => loadPlayers(currentRoom.id),
            onRoomUpdate: (room) => {
                setCurrentRoom(room);
                if (room.status === 'playing') {
                    // Game started! Navigate to battle
                    alert('Game starting! 🎮'); // TODO: navigate to multiplayer battle
                }
            }
        });
        return () => unsubscribe(channel);
    }, [currentRoom?.id]);

    const loadRooms = async () => {
        setLoading(true);
        const data = await fetchRooms();
        setRooms(data);
        setLoading(false);
    };

    const loadPlayers = async (roomId: string) => {
        const data = await getPlayersInRoom(roomId);
        setPlayers(data);
    };

    const handleCreateRoom = async () => {
        if (!roomName.trim()) return;
        setPlayerName(playerName);
        const room = await createRoom(roomName.trim(), maxPlayers, isPrivate);
        if (room) {
            setCurrentRoom(room);
            setTab('lobby');
        }
    };

    const handleJoinRoom = async (roomId: string) => {
        setPlayerName(playerName);
        const player = await joinRoom(roomId);
        if (player) {
            const { data } = await (await import('../../core/services/SupabaseClient')).supabase
                .from('rooms').select('*').eq('id', roomId).single();
            if (data) {
                setCurrentRoom(data);
                setTab('lobby');
            }
        }
    };

    const handleLeave = async () => {
        if (currentRoom) {
            await leaveRoom(currentRoom.id);
            setCurrentRoom(null);
            setPlayers([]);
            setTab('rooms');
            loadRooms();
        }
    };

    const handleReady = async () => {
        if (!currentRoom) return;
        await setReady(currentRoom.id, true);
    };

    const handleStart = async () => {
        if (!currentRoom) return;
        const allReady = players.every(p => p.is_ready || p.is_host);
        if (allReady && players.length >= 2) {
            await startGame(currentRoom.id);
        }
    };

    return (
        <div className="game-bg min-h-[100svh] w-full flex flex-col items-center relative overflow-y-auto">
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={currentRoom ? handleLeave : onBack}
                className="absolute top-4 left-4 z-20 p-3 glass-card rounded-xl text-zinc-400 hover:text-white transition-all flex items-center gap-2"
            >
                <ArrowLeft size={18} />
                <span className="text-sm font-bold">{currentRoom ? 'Leave' : t('menu.back')}</span>
            </motion.button>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center mt-16 mb-4"
            >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <Users size={32} />
                </div>
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                    {t('menu.multiplayer')}
                </h2>
            </motion.div>

            {/* Player Name */}
            {!currentRoom && (
                <div className="flex items-center gap-2 mb-4 px-4 w-full max-w-lg">
                    <span className="text-xs text-zinc-400">Name:</span>
                    <input
                        type="text"
                        value={playerName}
                        onChange={(e) => { setName(e.target.value); setPlayerName(e.target.value); }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-white text-sm
                                   focus:border-emerald-500/50 focus:outline-none transition-all"
                        maxLength={20}
                    />
                </div>
            )}

            {/* ═══════════════════════════════════════ */}
            {/* IN ROOM LOBBY */}
            {/* ═══════════════════════════════════════ */}
            {tab === 'lobby' && currentRoom ? (
                <div className="flex-1 px-4 pb-8 w-full max-w-lg">
                    <div className="glass-card rounded-2xl p-5 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">{currentRoom.name}</h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                                {currentRoom.status}
                            </span>
                        </div>

                        <div className="space-y-2 mb-4">
                            {players.map((p) => (
                                <div key={p.id} className="flex items-center justify-between glass-card rounded-xl p-3">
                                    <div className="flex items-center gap-2">
                                        {p.is_host && <Crown size={14} className="text-yellow-400" />}
                                        <span className="font-bold text-sm text-white">{p.player_name}</span>
                                        <span className="text-[10px] text-zinc-500 uppercase">{p.player_class}</span>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.is_ready ? 'bg-emerald-500/20 text-emerald-300' :
                                            p.is_host ? 'bg-yellow-500/20 text-yellow-300' :
                                                'bg-zinc-700 text-zinc-400'
                                        }`}>
                                        {p.is_host ? '👑 Host' : p.is_ready ? '✅ Ready' : '⏳ Waiting'}
                                    </span>
                                </div>
                            ))}

                            {/* Empty slots */}
                            {Array.from({ length: currentRoom.max_players - players.length }).map((_, i) => (
                                <div key={`empty-${i}`} className="glass-card rounded-xl p-3 opacity-30 text-center text-zinc-600 text-sm">
                                    Empty slot...
                                </div>
                            ))}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={handleReady}
                                className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition"
                            >
                                ✅ Ready
                            </button>
                            {players.find(p => p.is_host) && (
                                <button
                                    onClick={handleStart}
                                    disabled={players.length < 2 || !players.every(p => p.is_ready || p.is_host)}
                                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm
                                               disabled:opacity-30 disabled:cursor-not-allowed hover:from-amber-400 hover:to-orange-400 transition"
                                >
                                    ⚔️ Start Game
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Tabs */}
                    <div className="flex gap-2 mb-4 w-full max-w-lg px-4">
                        <button
                            onClick={() => setTab('rooms')}
                            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                            ${tab === 'rooms' ? 'bg-emerald-500 text-white' : 'glass-card text-zinc-400 hover:text-white'}`}
                        >
                            <Globe size={16} /> Browse Rooms
                        </button>
                        <button
                            onClick={() => setTab('create')}
                            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                            ${tab === 'create' ? 'bg-emerald-500 text-white' : 'glass-card text-zinc-400 hover:text-white'}`}
                        >
                            <Plus size={16} /> Create Room
                        </button>
                    </div>

                    <div className="flex-1 px-4 pb-8 w-full max-w-lg">
                        <AnimatePresence mode="wait">
                            {tab === 'rooms' ? (
                                <motion.div key="rooms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                                    {/* Refresh */}
                                    <button onClick={loadRooms} className="glass-card rounded-xl px-4 py-2 text-xs text-zinc-400 hover:text-white transition flex items-center gap-1 ml-auto">
                                        <RefreshCw size={12} /> Refresh
                                    </button>

                                    {loading ? (
                                        <div className="text-center text-zinc-500 py-8">Loading rooms...</div>
                                    ) : rooms.length === 0 ? (
                                        <div className="text-center text-zinc-500 py-8">
                                            <div className="text-4xl mb-2">🏚️</div>
                                            No rooms found. Create one!
                                        </div>
                                    ) : (
                                        rooms.map((room, i) => (
                                            <motion.div
                                                key={room.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="glass-card rounded-xl p-4 flex items-center justify-between hover:border-emerald-500/20 transition"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${room.status === 'waiting' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {room.status === 'waiting' ? <Wifi size={18} /> : <Swords size={18} />}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-sm text-white">{room.name}</span>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[10px] text-zinc-500">
                                                                <Crown size={10} className="inline mr-0.5" /> {room.host_name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleJoinRoom(room.id)}
                                                    disabled={room.status !== 'waiting'}
                                                    className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold
                                                           hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-500 transition flex items-center gap-1"
                                                >
                                                    <LogIn size={12} /> Join
                                                </button>
                                            </motion.div>
                                        ))
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div key="create" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                    <div className="glass-card rounded-xl p-5 space-y-4">
                                        <div>
                                            <label className="text-sm font-bold text-zinc-300 mb-2 block">Room Name</label>
                                            <input
                                                type="text"
                                                value={roomName}
                                                onChange={e => setRoomName(e.target.value)}
                                                placeholder="e.g. Word Warriors"
                                                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-zinc-600
                                                       focus:border-emerald-500/50 focus:outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-zinc-300 mb-2 block">Max Players</label>
                                            <div className="flex gap-2">
                                                {[2, 3, 4].map(n => (
                                                    <button
                                                        key={n}
                                                        onClick={() => setMaxPlayers(n)}
                                                        className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all
                                                        ${maxPlayers === n ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                                                    >
                                                        {n}P
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <Lock size={16} className="text-zinc-400" />
                                                <span className="text-sm font-bold text-zinc-300">Private Room</span>
                                            </div>
                                            <button
                                                onClick={() => setIsPrivate(!isPrivate)}
                                                className={`w-14 h-8 rounded-full transition-all relative ${isPrivate ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                                            >
                                                <motion.div
                                                    className="w-6 h-6 bg-white rounded-full absolute top-1"
                                                    animate={{ left: isPrivate ? '1.75rem' : '0.25rem' }}
                                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCreateRoom}
                                        disabled={!roomName.trim()}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-base
                                               uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed
                                               shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all
                                               flex items-center justify-center gap-3"
                                    >
                                        <Plus size={20} /> Create & Join
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </>
            )}
        </div>
    );
};
