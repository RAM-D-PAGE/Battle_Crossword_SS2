import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Crown, Medal, Star } from 'lucide-react';
import { t } from '../../core/i18n';

interface LeaderboardProps {
    onBack: () => void;
}

// Mock leaderboard data
const MOCK_LEADERBOARD = [
    { rank: 1, name: 'WordMaster', score: 12450, level: 7, classIcon: '📜', className: 'Scribe' },
    { rank: 2, name: 'Thai_Champion', score: 11200, level: 7, classIcon: '🗡️', className: 'Rogue' },
    { rank: 3, name: 'SpellBinder', score: 9800, level: 6, classIcon: '🔮', className: 'Warlock' },
    { rank: 4, name: 'DragonSlayer', score: 8500, level: 5, classIcon: '🪓', className: 'Barbarian' },
    { rank: 5, name: 'HolyKnight', score: 7200, level: 5, classIcon: '⚔️', className: 'Paladin' },
    { rank: 6, name: 'WordSmithy', score: 6800, level: 4, classIcon: '✝️', className: 'Cleric' },
    { rank: 7, name: 'LexiconHero', score: 5500, level: 4, classIcon: '📜', className: 'Scribe' },
    { rank: 8, name: 'VocabKing', score: 4200, level: 3, classIcon: '🪓', className: 'Barbarian' },
    { rank: 9, name: 'NewPlayer1', score: 2800, level: 2, classIcon: '🗡️', className: 'Rogue' },
    { rank: 10, name: 'Beginner42', score: 1500, level: 1, classIcon: '✝️', className: 'Cleric' },
];

const getRankIcon = (rank: number) => {
    switch (rank) {
        case 1: return <Crown size={18} className="text-yellow-400" />;
        case 2: return <Medal size={18} className="text-slate-300" />;
        case 3: return <Medal size={18} className="text-amber-600" />;
        default: return <span className="text-xs font-mono text-zinc-500 w-[18px] text-center">{rank}</span>;
    }
};

const getRankBg = (rank: number) => {
    switch (rank) {
        case 1: return 'bg-gradient-to-r from-yellow-500/10 to-amber-500/5 border-yellow-500/20';
        case 2: return 'bg-gradient-to-r from-slate-400/10 to-zinc-500/5 border-slate-400/20';
        case 3: return 'bg-gradient-to-r from-amber-700/10 to-amber-900/5 border-amber-700/20';
        default: return 'border-white/5';
    }
};

export const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
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
                <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white mb-4 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                    <Trophy size={32} />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
                    {t('menu.leaderboard')}
                </h2>
                <p className="text-zinc-500 text-sm mt-1">{t('leaderboard.subtitle')}</p>
            </motion.div>

            {/* Top 3 Podium */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-end gap-3 mb-6 px-4"
            >
                {/* 2nd place */}
                <div className="flex flex-col items-center">
                    <span className="text-2xl mb-2">{MOCK_LEADERBOARD[1].classIcon}</span>
                    <div className="glass-card rounded-t-xl p-3 w-24 h-20 flex flex-col items-center justify-center border-slate-400/20">
                        <Medal size={16} className="text-slate-300 mb-1" />
                        <span className="text-[10px] text-white font-bold truncate w-full text-center">{MOCK_LEADERBOARD[1].name}</span>
                        <span className="text-xs text-yellow-300 font-mono font-bold">{MOCK_LEADERBOARD[1].score.toLocaleString()}</span>
                    </div>
                </div>
                {/* 1st place */}
                <div className="flex flex-col items-center">
                    <span className="text-3xl mb-2">{MOCK_LEADERBOARD[0].classIcon}</span>
                    <div className="glass-card rounded-t-xl p-3 w-28 h-28 flex flex-col items-center justify-center border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.15)]">
                        <Crown size={20} className="text-yellow-400 mb-1" />
                        <span className="text-[11px] text-white font-bold truncate w-full text-center">{MOCK_LEADERBOARD[0].name}</span>
                        <span className="text-sm text-yellow-300 font-mono font-bold">{MOCK_LEADERBOARD[0].score.toLocaleString()}</span>
                        <span className="text-[9px] text-zinc-500">{t('menu.level')}{MOCK_LEADERBOARD[0].level}</span>
                    </div>
                </div>
                {/* 3rd place */}
                <div className="flex flex-col items-center">
                    <span className="text-2xl mb-2">{MOCK_LEADERBOARD[2].classIcon}</span>
                    <div className="glass-card rounded-t-xl p-3 w-24 h-16 flex flex-col items-center justify-center border-amber-700/20">
                        <Medal size={16} className="text-amber-600 mb-1" />
                        <span className="text-[10px] text-white font-bold truncate w-full text-center">{MOCK_LEADERBOARD[2].name}</span>
                        <span className="text-xs text-yellow-300 font-mono font-bold">{MOCK_LEADERBOARD[2].score.toLocaleString()}</span>
                    </div>
                </div>
            </motion.div>

            {/* Leaderboard List */}
            <div className="flex-1 overflow-y-auto px-4 pb-8 w-full max-w-lg">
                <div className="space-y-2">
                    {MOCK_LEADERBOARD.map((entry, i) => (
                        <motion.div
                            key={entry.rank}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.05 }}
                            className={`glass-card rounded-xl px-4 py-3 flex items-center gap-3 transition-all ${getRankBg(entry.rank)}`}
                        >
                            <div className="w-8 flex justify-center">
                                {getRankIcon(entry.rank)}
                            </div>
                            <span className="text-xl">{entry.classIcon}</span>
                            <div className="flex-1 min-w-0">
                                <span className="text-sm font-bold text-white block truncate">{entry.name}</span>
                                <span className="text-[10px] text-zinc-500">{entry.className} • {t('menu.level')}{entry.level}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-mono font-bold text-yellow-300">
                                    {entry.score.toLocaleString()}
                                </div>
                                <div className="text-[9px] text-zinc-500 flex items-center gap-0.5 justify-end">
                                    <Star size={8} className="text-yellow-500" /> pts
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
