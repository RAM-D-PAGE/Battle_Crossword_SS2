import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { t } from '../../core/i18n';

export const GameOverOverlay: React.FC = () => {
    const { gameStatus, score, currentLevel, nextLevel, resetGame } = useGameStore();

    if (gameStatus !== 'victory' && gameStatus !== 'defeat') return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[60] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center gap-6"
            >
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="text-7xl mb-2"
                >
                    {gameStatus === 'victory' ? '🏆' : '💀'}
                </motion.div>
                <motion.h2
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`text-5xl md:text-7xl font-black uppercase tracking-tight
                        ${gameStatus === 'victory'
                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500'
                            : 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-700'}`}
                >
                    {gameStatus === 'victory' ? t('gameOver.victory') : t('gameOver.defeat')}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-zinc-400 font-mono"
                >
                    {gameStatus === 'victory'
                        ? `${t('gameOver.scoreLabel')}: ${score} • ${t('gameOver.levelComplete')}`
                        : t('gameOver.journeyEnds')}
                </motion.p>
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={gameStatus === 'victory' ? nextLevel : resetGame}
                    className="px-10 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all"
                >
                    {gameStatus === 'victory' ? t('gameOver.nextLevel') : t('gameOver.returnMenu')}
                </motion.button>
            </motion.div>
        </AnimatePresence>
    );
};
