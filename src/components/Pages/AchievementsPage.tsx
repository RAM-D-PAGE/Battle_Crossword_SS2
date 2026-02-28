import React from 'react';
import { motion } from 'framer-motion';
import { ACHIEVEMENTS, GameStats } from '../../core/data/Achievements';
import { useSettingsStore } from '../../store/useSettingsStore';

interface AchievementsPageProps {
    stats: GameStats;
    unlockedIds: string[];
    onBack: () => void;
}

const AchievementsPage: React.FC<AchievementsPageProps> = ({ stats, unlockedIds, onBack }) => {
    const { language } = useSettingsStore();

    const totalGoldReward = ACHIEVEMENTS
        .filter(a => unlockedIds.includes(a.id))
        .reduce((sum, a) => sum + (a.reward?.gold || 0), 0);

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-purple-950 to-zinc-950 text-white p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button onClick={onBack} className="glass-card px-4 py-2 rounded-xl text-sm hover:bg-white/10 transition">
                    ← Back
                </button>
                <div className="text-center">
                    <h1 className="text-2xl font-black tracking-wide">🏆 Achievements</h1>
                    <p className="text-xs text-zinc-400 mt-1">
                        {unlockedIds.length}/{ACHIEVEMENTS.length} unlocked • 💰 {totalGoldReward} gold earned
                    </p>
                </div>
                <div className="w-20" />
            </div>

            {/* Achievement Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {ACHIEVEMENTS.map((ach, i) => {
                    const unlocked = unlockedIds.includes(ach.id);
                    return (
                        <motion.div
                            key={ach.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className={`glass-card rounded-xl p-4 border transition ${unlocked
                                    ? 'border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-orange-500/5'
                                    : 'border-zinc-800/30 opacity-60'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <span className={`text-3xl ${unlocked ? '' : 'grayscale'}`}>
                                    {unlocked ? ach.icon : '🔒'}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`font-bold text-sm ${unlocked ? 'text-amber-300' : 'text-zinc-500'}`}>
                                        {language === 'th' ? ach.nameTh : ach.name}
                                    </h3>
                                    <p className="text-xs text-zinc-400 mt-0.5">
                                        {language === 'th' ? ach.descriptionTh : ach.description}
                                    </p>
                                    {ach.reward && (
                                        <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full ${unlocked
                                                ? 'bg-amber-500/20 text-amber-300'
                                                : 'bg-zinc-800 text-zinc-500'
                                            }`}>
                                            💰 +{ach.reward.gold} gold
                                        </span>
                                    )}
                                </div>
                                {unlocked && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="text-lg"
                                    >
                                        ✅
                                    </motion.span>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Stats Summary */}
            <div className="glass-card rounded-2xl p-4 max-w-2xl mx-auto mt-6 border border-zinc-800/30">
                <h3 className="text-sm font-bold text-zinc-300 mb-3">📊 Your Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    <StatItem label="Words" value={stats.totalWordsSpelled} />
                    <StatItem label="Longest" value={`${stats.longestWord} letters`} />
                    <StatItem label="Max Combo" value={`${stats.highestCombo}x`} />
                    <StatItem label="Enemies" value={stats.enemiesDefeated} />
                    <StatItem label="Level" value={stats.playerLevel} />
                    <StatItem label="Gold" value={`💰 ${stats.goldEarned}`} />
                    <StatItem label="Crits" value={stats.criticalHits} />
                    <StatItem label="Skills" value={stats.skillsUsed} />
                    <StatItem label="Chapters" value={`${stats.chaptersCompleted}/5`} />
                </div>
            </div>
        </div>
    );
};

const StatItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-zinc-900/50 rounded-lg p-2 text-center">
        <div className="text-zinc-500 text-[10px] uppercase tracking-wider">{label}</div>
        <div className="text-white font-bold">{value}</div>
    </div>
);

export default AchievementsPage;
