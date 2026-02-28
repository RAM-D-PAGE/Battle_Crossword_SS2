import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Skull, Shield, Zap, Heart, Lock } from 'lucide-react';
import { ENEMIES, EnemyData } from '../../core/data/Enemies';
import { useGameStore } from '../../store/useGameStore';
import { t } from '../../core/i18n';

interface BestiaryProps {
    onBack: () => void;
}

const ELEMENT_ICONS: Record<string, { icon: string; color: string }> = {
    Fire: { icon: '🔥', color: 'text-orange-400' },
    Ice: { icon: '❄️', color: 'text-cyan-400' },
    Thunder: { icon: '⚡', color: 'text-yellow-400' },
    Nature: { icon: '🌿', color: 'text-green-400' },
    Dark: { icon: '🌑', color: 'text-purple-400' },
    Light: { icon: '✨', color: 'text-amber-300' },
    Arcane: { icon: '💫', color: 'text-pink-400' },
    Neutral: { icon: '⚪', color: 'text-zinc-400' },
};

export const Bestiary: React.FC<BestiaryProps> = ({ onBack }) => {
    const [selectedEnemy, setSelectedEnemy] = useState<EnemyData | null>(null);
    const currentLevel = useGameStore(s => s.currentLevel);

    // Enemies up to current level are "discovered"
    const discoveredIds = ENEMIES.slice(0, currentLevel).map(e => e.id);

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
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white mb-4 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                    <Skull size={32} />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                    {t('menu.bestiary')}
                </h2>
                <p className="text-zinc-500 text-sm mt-1">
                    {discoveredIds.length}/{ENEMIES.length} {t('bestiary.discovered')}
                </p>
            </motion.div>

            {/* Enemy Grid */}
            <div className="flex-1 overflow-y-auto px-4 pb-8 w-full max-w-2xl">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ENEMIES.map((enemy, i) => {
                        const isDiscovered = discoveredIds.includes(enemy.id);
                        const el = ELEMENT_ICONS[enemy.element];

                        return (
                            <motion.button
                                key={enemy.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.06 }}
                                whileHover={isDiscovered ? { scale: 1.04, y: -3 } : {}}
                                whileTap={isDiscovered ? { scale: 0.97 } : {}}
                                onClick={() => isDiscovered && setSelectedEnemy(enemy)}
                                className={`glass-card rounded-xl p-4 flex flex-col items-center gap-2 transition-all relative overflow-hidden
                                    ${isDiscovered ? 'cursor-pointer hover:border-amber-500/20' : 'opacity-50 cursor-not-allowed'}
                                    ${selectedEnemy?.id === enemy.id ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : ''}`}
                            >
                                {!isDiscovered && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-xl">
                                        <Lock size={24} className="text-zinc-600" />
                                    </div>
                                )}
                                <span className="text-3xl">{el.icon}</span>
                                <span className="font-bold text-xs text-white">{isDiscovered ? enemy.name : '???'}</span>
                                <span className="text-[10px] text-zinc-500 font-mono">{t('menu.level')}{i + 1}</span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Enemy Detail Modal */}
            <AnimatePresence>
                {selectedEnemy && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setSelectedEnemy(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="glass-card rounded-2xl p-6 max-w-sm w-full"
                        >
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-6xl">{ELEMENT_ICONS[selectedEnemy.element].icon}</span>
                                <h3 className="text-2xl font-black text-white">{selectedEnemy.name}</h3>
                                <p className="text-sm text-zinc-400 text-center">{selectedEnemy.description}</p>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-3 w-full mt-2">
                                    <div className="glass-card rounded-lg p-3 flex items-center gap-2">
                                        <Heart size={16} className="text-red-400" />
                                        <div>
                                            <div className="text-[10px] text-zinc-500 uppercase">HP</div>
                                            <div className="text-sm font-bold text-white font-mono">{selectedEnemy.maxHp}</div>
                                        </div>
                                    </div>
                                    <div className="glass-card rounded-lg p-3 flex items-center gap-2">
                                        <Zap size={16} className="text-yellow-400" />
                                        <div>
                                            <div className="text-[10px] text-zinc-500 uppercase">{t('bestiary.attack')}</div>
                                            <div className="text-sm font-bold text-white font-mono">{selectedEnemy.damage}</div>
                                        </div>
                                    </div>
                                    <div className="glass-card rounded-lg p-3 flex items-center gap-2">
                                        <Shield size={16} className="text-blue-400" />
                                        <div>
                                            <div className="text-[10px] text-zinc-500 uppercase">{t('bestiary.element')}</div>
                                            <div className={`text-sm font-bold font-mono ${ELEMENT_ICONS[selectedEnemy.element].color}`}>
                                                {selectedEnemy.element}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="glass-card rounded-lg p-3 flex items-center gap-2">
                                        <Skull size={16} className="text-zinc-400" />
                                        <div>
                                            <div className="text-[10px] text-zinc-500 uppercase">{t('bestiary.speed')}</div>
                                            <div className="text-sm font-bold text-white font-mono">{selectedEnemy.attackInterval}s</div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedEnemy(null)}
                                    className="mt-2 px-8 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-sm uppercase tracking-widest hover:bg-amber-400 transition-all"
                                >
                                    {t('settings.close')}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
