import React from 'react';
import { motion } from 'framer-motion';
import { Timer, Swords, Shield, Skull } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { ENEMIES } from '../../core/data/Enemies';
import { t } from '../../core/i18n';

const Pct = (cur: number, max: number) => Math.max(0, Math.min(100, (cur / max) * 100));

interface BattleHUDProps {
    timer: number;
}

export const BattleHUD: React.FC<BattleHUDProps> = ({ timer }) => {
    const {
        playerHp, playerMaxHp, playerMp, playerMaxMp,
        enemyHp, enemyMaxHp, enemyId,
        isPlayerTurn, playerClass, score, currentLevel,
        gold, playerLevel, playerXp, xpToNextLevel,
        combo, statusEffects
    } = useGameStore();

    const { timerEnabled } = useSettingsStore();
    const currentEnemy = ENEMIES.find(e => e.id === enemyId);

    return (
        <div className="w-full max-w-2xl px-2 flex flex-col gap-3">
            {/* Enemy HUD */}
            <div className="glass-card rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <Skull size={18} className="text-red-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-zinc-500 bg-zinc-800/80 px-2 py-0.5 rounded">{t('menu.level')}{currentLevel}</span>
                                <span className="font-bold text-lg text-white">{currentEnemy?.name || 'Unknown'}</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 -mt-0.5">{currentEnemy?.description || ''}</p>
                        </div>
                    </div>
                    <span className="font-mono text-sm text-red-300 bg-red-500/10 px-3 py-1 rounded-lg">
                        {enemyHp}/{enemyMaxHp}
                    </span>
                </div>
                <div className="w-full h-4 bar-track rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bar-hp-fill rounded-full"
                        animate={{ width: `${Pct(enemyHp, enemyMaxHp)}%` }}
                        transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                    />
                </div>
            </div>

            {/* Turn Indicator + Timer */}
            <div className="flex justify-center items-center gap-3">
                <motion.div
                    animate={{ scale: isPlayerTurn ? [1, 1.02, 1] : 1 }}
                    transition={{ duration: 1, repeat: isPlayerTurn ? Infinity : 0 }}
                    className={`
                        flex items-center gap-2 px-5 py-1.5 rounded-full font-mono font-bold text-sm border transition-all
                        ${isPlayerTurn
                            ? 'bg-indigo-500/20 border-indigo-400/50 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                            : 'bg-red-500/20 border-red-400/50 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.2)]'}
                    `}
                >
                    {isPlayerTurn ? <Shield size={14} /> : <Swords size={14} />}
                    {isPlayerTurn ? t('battle.yourTurn') : t('battle.enemyTurn')}
                </motion.div>
                {timerEnabled && (
                    <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-mono text-sm border transition-all
                        ${timer <= 10 ? 'bg-red-500/20 border-red-500/50 text-red-300 animate-pulse' : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400'}
                    `}>
                        <Timer size={14} /> {timer}s
                    </div>
                )}
            </div>

            {/* Combo Counter + Status Effects */}
            {(combo > 0 || statusEffects.length > 0) && (
                <div className="flex justify-center items-center gap-3">
                    {combo > 0 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="px-4 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-black shadow-[0_0_12px_rgba(249,115,22,0.4)]"
                        >
                            🔥 {combo}x COMBO
                        </motion.div>
                    )}
                    {statusEffects.map((e, i) => (
                        <span key={i} className={`px-3 py-1 rounded-full text-[10px] font-bold ${e.type === 'burn' ? 'bg-red-500/20 text-red-300' :
                                e.type === 'freeze' ? 'bg-cyan-500/20 text-cyan-300' :
                                    'bg-green-500/20 text-green-300'
                            }`}>
                            {e.type === 'burn' ? '🔥' : e.type === 'freeze' ? '❄️' : '☠️'} {e.turnsLeft}t
                        </span>
                    ))}
                </div>
            )}

            {/* Player HUD */}
            <div className="w-full glass-card rounded-2xl p-3 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{playerClass?.icon || '⚔️'}</span>
                        <span className="font-bold text-sm text-white">{playerClass?.name || 'Unknown'}</span>
                        <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/20 px-1.5 rounded">Lv.{playerLevel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-yellow-300">💰 {gold}</span>
                        <span className="font-mono text-xs text-zinc-500">🏆 {score}</span>
                    </div>
                </div>

                {/* HP Bar */}
                <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-blue-300 mb-0.5">
                        <span>HP</span>
                        <span className="font-mono">{playerHp}/{playerMaxHp}</span>
                    </div>
                    <div className="w-full h-3 bar-track rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bar-player-hp-fill rounded-full"
                            animate={{ width: `${Pct(playerHp, playerMaxHp)}%` }}
                            transition={{ type: 'spring', stiffness: 60 }}
                        />
                    </div>
                </div>

                {/* MP Bar */}
                <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-purple-300 mb-0.5">
                        <span>MP</span>
                        <span className="font-mono">{playerMp}/{playerMaxMp}</span>
                    </div>
                    <div className="w-full h-2 bar-track rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bar-mp-fill rounded-full"
                            animate={{ width: `${Pct(playerMp, playerMaxMp)}%` }}
                            transition={{ type: 'spring', stiffness: 60 }}
                        />
                    </div>
                </div>

                {/* XP Bar */}
                <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-yellow-300 mb-0.5">
                        <span>XP</span>
                        <span className="font-mono">{playerXp}/{xpToNextLevel}</span>
                    </div>
                    <div className="w-full h-1.5 bar-track rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full"
                            animate={{ width: `${Pct(playerXp, xpToNextLevel)}%` }}
                            transition={{ type: 'spring', stiffness: 60 }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
