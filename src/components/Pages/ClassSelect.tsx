import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { CLASSES } from '../../core/data/Classes';
import { t } from '../../core/i18n';

interface ClassSelectProps {
    onBack: () => void;
}

export const ClassSelect: React.FC<ClassSelectProps> = ({ onBack }) => {
    const { initializeGame, startBattle } = useGameStore();

    const handleSelectClass = (classId: string) => {
        initializeGame(classId);
        startBattle('slime_king');
    };

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

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center mt-16 mb-8"
            >
                <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">
                    {t('menu.selectClass')}
                </h2>
                <p className="text-zinc-500 text-sm mt-2">{t('menu.selectClassDesc')}</p>
            </motion.div>

            {/* Class Grid */}
            <div className="flex-1 overflow-y-auto px-4 pb-8 w-full max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CLASSES.map((c, i) => (
                        <motion.button
                            key={c.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.08 }}
                            whileHover={{ scale: 1.03, y: -4 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleSelectClass(c.id)}
                            className="glass-card rounded-2xl p-6 flex flex-col items-center gap-3 group cursor-pointer hover:border-indigo-500/30 transition-all relative overflow-hidden"
                        >
                            {/* Background glow on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-violet-500/0 group-hover:from-indigo-500/5 group-hover:to-violet-500/5 transition-all rounded-2xl" />

                            <span className="text-6xl group-hover:scale-115 transition-transform duration-300 relative z-10">
                                {c.icon}
                            </span>
                            <span className="font-black text-xl text-white group-hover:text-indigo-300 transition-colors relative z-10">
                                {c.name}
                            </span>
                            <span className="text-xs text-zinc-400 text-center leading-relaxed max-w-[200px] relative z-10">
                                {c.description}
                            </span>

                            {/* Stats */}
                            <div className="flex gap-3 mt-2 relative z-10">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <span className="text-red-400 text-xs">❤️</span>
                                    <span className="text-red-300 text-xs font-mono font-bold">{c.baseHp}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                    <span className="text-purple-400 text-xs">💧</span>
                                    <span className="text-purple-300 text-xs font-mono font-bold">{c.baseMp}</span>
                                </div>
                            </div>

                            {/* Passive hint */}
                            <div className="mt-1 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/15 relative z-10">
                                <span className="text-[10px] text-indigo-300 font-mono">
                                    {c.passiveDescription}
                                </span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};
