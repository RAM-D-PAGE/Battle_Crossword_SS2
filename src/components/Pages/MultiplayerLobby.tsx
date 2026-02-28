import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Plus, LogIn, Globe, Lock, Wifi, Crown, Swords } from 'lucide-react';
import { t } from '../../core/i18n';

interface MultiplayerLobbyProps {
    onBack: () => void;
}

// Mock rooms for demo
const MOCK_ROOMS = [
    { id: '1', name: 'Word Warriors', host: 'Player_42', players: 1, maxPlayers: 2, status: 'waiting', level: 5 },
    { id: '2', name: 'Epic Battle', host: 'Thai_Gamer', players: 2, maxPlayers: 2, status: 'playing', level: 12 },
    { id: '3', name: 'Beginners Welcome', host: 'NewPlayer', players: 1, maxPlayers: 2, status: 'waiting', level: 1 },
    { id: '4', name: 'Speed Run!', host: 'SpeedyWords', players: 1, maxPlayers: 4, status: 'waiting', level: 8 },
];

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ onBack }) => {
    const [tab, setTab] = useState<'rooms' | 'create'>('rooms');
    const [roomName, setRoomName] = useState('');
    const [maxPlayers, setMaxPlayers] = useState(2);
    const [isPrivate, setIsPrivate] = useState(false);

    return (
        <div className="game-bg h-[100svh] w-full flex flex-col items-center relative overflow-hidden">
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={onBack}
                className="absolute top-4 left-4 z-20 p-3 glass-card rounded-xl text-zinc-400 hover:text-white transition-all flex items-center gap-2"
            >
                <ArrowLeft size={18} />
                <span className="text-sm font-bold">{t('menu.back')}</span>
            </motion.button>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center mt-16 mb-6"
            >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <Users size={32} />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                    {t('menu.multiplayer')}
                </h2>
                <p className="text-zinc-500 text-sm mt-1">{t('multi.subtitle')}</p>
            </motion.div>

            {/* Online indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20"
            >
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-300 font-mono">{t('multi.online')}: 128</span>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 w-full max-w-lg px-4">
                <button
                    onClick={() => setTab('rooms')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${tab === 'rooms' ? 'bg-emerald-500 text-white' : 'glass-card text-zinc-400 hover:text-white'
                        }`}
                >
                    <Globe size={16} /> {t('multi.browseRooms')}
                </button>
                <button
                    onClick={() => setTab('create')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${tab === 'create' ? 'bg-emerald-500 text-white' : 'glass-card text-zinc-400 hover:text-white'
                        }`}
                >
                    <Plus size={16} /> {t('multi.createRoom')}
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-8 w-full max-w-lg">
                <AnimatePresence mode="wait">
                    {tab === 'rooms' ? (
                        <motion.div
                            key="rooms"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-3"
                        >
                            {MOCK_ROOMS.map((room, i) => (
                                <motion.div
                                    key={room.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className="glass-card rounded-xl p-4 flex items-center justify-between group hover:border-emerald-500/20 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${room.status === 'waiting'
                                            ? 'bg-emerald-500/20 text-emerald-400'
                                            : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {room.status === 'waiting' ? <Wifi size={18} /> : <Swords size={18} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm text-white">{room.name}</span>
                                                {room.status === 'playing' && (
                                                    <span className="text-[9px] px-1.5 py-0.5 bg-red-500/20 text-red-300 rounded font-mono">{t('multi.inGame')}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] text-zinc-500"><Crown size={10} className="inline mr-0.5" /> {room.host}</span>
                                                <span className="text-[10px] text-zinc-600">•</span>
                                                <span className="text-[10px] text-zinc-500 font-mono">Lv.{room.level}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono text-zinc-400">
                                            {room.players}/{room.maxPlayers}
                                        </span>
                                        <button
                                            disabled={room.status === 'playing' || room.players >= room.maxPlayers}
                                            className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-500 transition-all flex items-center gap-1"
                                        >
                                            <LogIn size={12} /> {t('multi.join')}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Quick Match */}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-base uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-3"
                            >
                                <Swords size={20} /> {t('multi.quickMatch')}
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="create"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="glass-card rounded-xl p-5 space-y-4">
                                {/* Room Name */}
                                <div>
                                    <label className="text-sm font-bold text-zinc-300 mb-2 block">{t('multi.roomName')}</label>
                                    <input
                                        type="text"
                                        value={roomName}
                                        onChange={e => setRoomName(e.target.value)}
                                        placeholder={t('multi.roomNamePlaceholder')}
                                        className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-zinc-600 focus:border-emerald-500/50 focus:outline-none transition-all"
                                    />
                                </div>

                                {/* Max Players */}
                                <div>
                                    <label className="text-sm font-bold text-zinc-300 mb-2 block">{t('multi.maxPlayers')}</label>
                                    <div className="flex gap-2">
                                        {[2, 3, 4].map(n => (
                                            <button
                                                key={n}
                                                onClick={() => setMaxPlayers(n)}
                                                className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all
                                                    ${maxPlayers === n ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                                            >
                                                {n} {t('multi.players')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Private Toggle */}
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Lock size={16} className="text-zinc-400" />
                                        <span className="text-sm font-bold text-zinc-300">{t('multi.privateRoom')}</span>
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

                            {/* Create Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-base uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-3"
                            >
                                <Plus size={20} /> {t('multi.createAndStart')}
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
