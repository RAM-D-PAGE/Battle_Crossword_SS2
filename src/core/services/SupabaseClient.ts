import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ═══════════════════════════════════════════════════
// Database Types
// ═══════════════════════════════════════════════════

export interface Room {
    id: string;
    name: string;
    host_id: string;
    host_name: string;
    max_players: number;
    status: 'waiting' | 'playing' | 'finished';
    is_private: boolean;
    created_at: string;
}

export interface Player {
    id: string;
    room_id: string;
    player_id: string;
    player_name: string;
    player_class: string;
    hp: number;
    max_hp: number;
    score: number;
    is_ready: boolean;
    is_host: boolean;
    created_at: string;
}

export interface GameAction {
    id: string;
    room_id: string;
    player_id: string;
    action_type: 'word_submit' | 'skill_use' | 'turn_end' | 'damage' | 'chat';
    payload: Record<string, any>;
    created_at: string;
}
