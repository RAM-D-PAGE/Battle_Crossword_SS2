import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Crown, Swords, Users, BookOpen, Trophy, Settings, ShoppingBag, Package, Map, Award } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { SettingsModal } from '../Game/SettingsModal';
import { t } from '../../core/i18n';
import { useState } from 'react';

interface MainMenuProps {
    onNavigate: (page: string) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
    const { playerClass, currentLevel, continueGame } = useGameStore();
    const [showSettings, setShowSettings] = useState(false);

    const menuButtons = [
        {
            id: 'newgame',
            icon: <Swords size={22} />,
            label: t('menu.newGame'),
            desc: t('menu.selectClass'),
            color: 'from-indigo-500 to-violet-600',
            glow: 'rgba(99,102,241,0.3)',
            action: () => onNavigate('classSelect'),
        },
        {
            id: 'multiplayer',
            icon: <Users size={22} />,
            label: t('menu.multiplayer'),
            desc: t('menu.multiplayerDesc'),
            color: 'from-emerald-500 to-teal-600',
            glow: 'rgba(16,185,129,0.3)',
            action: () => onNavigate('multiplayer'),
        },
        {
            id: 'bestiary',
            icon: <BookOpen size={22} />,
            label: t('menu.bestiary'),
            desc: t('menu.bestiaryDesc'),
            color: 'from-amber-500 to-orange-600',
            glow: 'rgba(245,158,11,0.3)',
            action: () => onNavigate('bestiary'),
        },
        {
            id: 'leaderboard',
            icon: <Trophy size={22} />,
            label: t('menu.leaderboard'),
            desc: t('menu.leaderboardDesc'),
            color: 'from-yellow-400 to-amber-500',
            glow: 'rgba(234,179,8,0.3)',
            action: () => onNavigate('leaderboard'),
        },
        {
            id: 'shop',
            icon: <ShoppingBag size={22} />,
            label: t('menu.shop'),
            desc: t('menu.shopDesc'),
            color: 'from-purple-500 to-pink-600',
            glow: 'rgba(168,85,247,0.3)',
            action: () => onNavigate('shop'),
        },
        {
            id: 'inventory',
            icon: <Package size={22} />,
            label: t('menu.inventory'),
            desc: t('menu.inventoryDesc'),
            color: 'from-cyan-500 to-blue-600',
            glow: 'rgba(6,182,212,0.3)',
            action: () => onNavigate('inventory'),
        },
        {
            id: 'worldMap',
            icon: <Map size={22} />,
            label: '🗺️ World Map',
            desc: 'Explore chapters',
            color: 'from-rose-500 to-red-600',
            glow: 'rgba(244,63,94,0.3)',
            action: () => onNavigate('worldMap'),
        },
        {
            id: 'achievements',
            icon: <Award size={22} />,
            label: '🏆 Achievements',
            desc: 'Track your progress',
            color: 'from-amber-400 to-yellow-500',
            glow: 'rgba(251,191,36,0.3)',
            action: () => onNavigate('achievements'),
        },
    ];

    return (
        <div className="game-bg min-h-[100svh] w-full flex flex-col items-center justify-start py-8 relative overflow-y-auto">
            {/* ── Animated Background Particles ── */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${2 + Math.random() * 4}px`,
                            height: `${2 + Math.random() * 4}px`,
                            background: `rgba(${99 + Math.random() * 140}, ${102 + Math.random() * 100}, ${241}, ${0.15 + Math.random() * 0.2})`,
                        }}
                        animate={{
                            y: [0, -(20 + Math.random() * 40), 0],
                            opacity: [0.15, 0.5, 0.15],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: Math.random() * 3,
                        }}
                    />
                ))}
            </div>

            {/* ── Settings Button ── */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => setShowSettings(true)}
                className="absolute top-4 right-4 z-20 p-3 glass-card rounded-xl text-zinc-400 hover:text-white hover:border-indigo-500/40 transition-all"
            >
                <Settings size={20} />
            </motion.button>

            {/* ── Title ── */}
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="flex flex-col items-center z-10 mb-6"
            >
                <Sparkles size={36} className="text-orange-400 mb-3 animate-pulse" />
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-400 via-orange-400 to-yellow-500 title-glow tracking-tight leading-tight">
                    {t('menu.title1')}
                </h1>
                <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-violet-500 tracking-[0.2em] -mt-1">
                    {t('menu.title2')}
                </h1>
                <p className="text-zinc-500 text-sm mt-2 tracking-widest uppercase">{t('menu.subtitle')}</p>
            </motion.div>

            {/* ── Continue Button ── */}
            {playerClass && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={continueGame}
                    className="mb-6 px-10 py-4 glass-card rounded-2xl text-white font-bold text-lg uppercase tracking-widest hover:border-yellow-500/30 transition-all flex items-center gap-4 group z-10"
                >
                    <Crown size={22} className="text-yellow-400 group-hover:animate-bounce" />
                    <span>{t('menu.continue')}</span>
                    <div className="flex flex-col items-start bg-black/30 px-3 py-1 rounded-lg border border-white/10">
                        <span className="text-[10px] text-zinc-400 font-mono">{t('menu.level')}{currentLevel}</span>
                        <span className="text-[10px] text-indigo-400 uppercase">{playerClass.name}</span>
                    </div>
                </motion.button>
            )}

            {/* ── Menu Buttons Grid ── */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-3 px-4 max-w-xl w-full z-10"
            >
                {menuButtons.map((btn, i) => (
                    <motion.button
                        key={btn.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        whileHover={{ scale: 1.04, y: -3 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={btn.action}
                        className="glass-card rounded-xl p-5 flex flex-col items-center gap-2 group cursor-pointer hover:border-white/10 transition-all relative overflow-hidden"
                    >
                        {/* Glow effect */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                            style={{ boxShadow: `inset 0 0 30px ${btn.glow}` }}
                        />
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${btn.color} text-white shadow-lg group-hover:scale-110 transition-transform relative z-10`}>
                            {btn.icon}
                        </div>
                        <span className="font-bold text-sm text-white group-hover:text-indigo-200 relative z-10">{btn.label}</span>
                        <span className="text-[10px] text-zinc-500 text-center leading-tight relative z-10">{btn.desc}</span>
                    </motion.button>
                ))}
            </motion.div>

            {/* ── Version ── */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-4 text-zinc-700 text-xs font-mono z-10"
            >
                v2.0.0 — Battle CrossWord
            </motion.p>

            <SettingsModal show={showSettings} onClose={() => setShowSettings(false)} />
        </div>
    );
};
