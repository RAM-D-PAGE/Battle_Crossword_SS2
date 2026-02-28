-- ═══════════════════════════════════════════════════
-- Battle CrossWord — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════

-- Rooms table
CREATE TABLE rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    host_id TEXT NOT NULL,
    host_name TEXT NOT NULL DEFAULT 'Host',
    max_players INT DEFAULT 2,
    status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Players table
CREATE TABLE players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    player_id TEXT NOT NULL,
    player_name TEXT NOT NULL DEFAULT 'Player',
    player_class TEXT DEFAULT 'scribe',
    hp INT DEFAULT 100,
    max_hp INT DEFAULT 100,
    score INT DEFAULT 0,
    is_ready BOOLEAN DEFAULT FALSE,
    is_host BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game actions table (for turn sync)
CREATE TABLE game_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    player_id TEXT NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('word_submit', 'skill_use', 'turn_end', 'damage', 'chat')),
    payload JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_players_room ON players(room_id);
CREATE INDEX idx_actions_room ON game_actions(room_id);

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE game_actions;

-- Row Level Security (allow all for anon — game is public)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for rooms" ON rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for players" ON players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for game_actions" ON game_actions FOR ALL USING (true) WITH CHECK (true);

-- Auto-cleanup: delete rooms older than 24 hours
-- (Optional: run this as a cron job via pg_cron extension)
