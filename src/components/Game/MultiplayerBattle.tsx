import React, { useState, useEffect, useCallback } from 'react';
import {
    DndContext, DragOverlay, defaultDropAnimationSideEffects,
    DragStartEvent, DragEndEvent, useSensor, useSensors,
    PointerSensor, TouchSensor
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';

import { Skills } from './Skills';
import { Hand } from './Hand';
import { DamagePopup } from './DamagePopup';
import { Grid } from './Grid';
import { Tile } from './Tile';
import { BattleHUD } from './BattleHUD';
import { GameOverOverlay } from './GameOverOverlay';
import { HelpModal } from './HelpModal';
import { SettingsModal } from './SettingsModal';
import { MultiplayerSync } from './MultiplayerSync';

import { useGameStore } from '../../store/useGameStore';
import { useSettingsStore, FONT_SIZE_CONFIG } from '../../store/useSettingsStore';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useKeyboard } from '../../hooks/useKeyboard';
import { TileData } from '../../core/types';
import { HelpCircle, Flag, Settings, Lightbulb, Users } from 'lucide-react';
import { setLanguage, t } from '../../core/i18n';
import { findHints } from '../../core/engine/HintSystem';

export const MultiplayerBattle: React.FC = () => {
    const [activeTile, setActiveTile] = useState<TileData | null>(null);
    const [showHelp, setShowHelp] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [hintText, setHintText] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor)
    );

    const {
        placeTile, returnTileToHand,
        isPlayerTurn, isMultiplayer,
        popups, removePopup, resetGame,
        hand, multiplayerOpponentName
    } = useGameStore();

    const {
        fontSize, highContrast, screenShakeEnabled,
        language, tapToPlace
    } = useSettingsStore();

    const { timer, message, submitWord, damagePreview } = useGameLoop();

    // ══ Initialize i18n & CSS ══
    useEffect(() => setLanguage(language), [language]);
    useEffect(() => {
        const config = FONT_SIZE_CONFIG[fontSize];
        const root = document.documentElement;
        Object.entries(config).forEach(([key, value]) => root.style.setProperty(key, value));
    }, [fontSize]);
    useEffect(() => {
        document.body.classList.toggle('high-contrast', highContrast);
    }, [highContrast]);

    // ══ Keyboard Controls ══
    useKeyboard(submitWord, showHelp, setShowHelp);

    // ══ Handles ══
    const handleHint = useCallback(() => {
        const hints = findHints(hand, 3);
        if (hints.length > 0) {
            setHintText(`${t('battle.hintLabel')} ${hints.map(h => `${h.word} (${h.score}pts)`).join(', ')}`);
            setTimeout(() => setHintText(''), 5000);
        } else {
            setHintText(t('battle.noHints'));
            setTimeout(() => setHintText(''), 2000);
        }
    }, [hand]);

    const handleDragStart = (event: DragStartEvent) => {
        if (tapToPlace) return;
        const { active } = event;
        setActiveTile(active.data.current as TileData);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        if (tapToPlace) return;
        const { active, over } = event;
        const tileId = active.id as string;
        if (over) {
            const overId = over.id as string;
            if (overId.startsWith('slot-')) {
                placeTile(tileId, parseInt(overId.split('-')[1]));
            }
        } else {
            returnTileToHand(tileId);
        }
        setActiveTile(null);
    };

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: '0.5' } }
        })
    };

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <motion.div
                className="game-bg flex flex-col min-h-[100svh] md:h-[100svh] w-full text-white overflow-y-auto overflow-x-hidden md:overflow-hidden items-center justify-between py-2 md:py-4 px-1 md:px-2 relative pb-4 md:pb-10"
                animate={screenShakeEnabled && useGameStore.getState().screenShake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                transition={{ duration: 0.35 }}
            >
                {/* ── Status Messages ── */}
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.3 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
                        >
                            <div className="px-8 py-3 rounded-2xl bg-black/60 backdrop-blur-md border border-yellow-500/30">
                                <span className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 whitespace-nowrap drop-shadow-2xl">
                                    {message}
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {hintText && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 z-50 px-4 md:px-6 py-2 rounded-xl bg-indigo-900/80 backdrop-blur-md border border-indigo-400/30 text-indigo-200 font-mono text-sm"
                        >
                            💡 {hintText}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {!isPlayerTurn && isMultiplayer && !message && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-32 md:bottom-40 left-1/2 -translate-x-1/2 z-40 bg-zinc-900/90 border border-zinc-700/50 rounded-full px-6 py-2 flex items-center gap-3 backdrop-blur-md shadow-xl"
                        >
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                            <span className="text-zinc-300 font-medium">รอผู้เล่นอีกฝ่ายพิมพ์คำศัพท์...</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Visual Overlays ── */}
                <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                    <AnimatePresence>
                        {popups.map(popup => (
                            <DamagePopup key={popup.id} {...popup} onComplete={removePopup} />
                        ))}
                    </AnimatePresence>
                </div>
                <GameOverOverlay />

                {/* PVP Sync logic layer */}
                <MultiplayerSync />

                {/* ── Top Controls ── */}
                <button
                    onClick={() => setShowSettings(true)}
                    className="absolute top-2 right-2 z-30 p-2 glass-card rounded-lg text-zinc-400 hover:text-white transition-all"
                    title="Settings"
                >
                    <Settings size={16} />
                </button>

                <div className="absolute top-2 left-2 z-30 flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-lg border border-zinc-700/30">
                    <Users size={14} className="text-indigo-400" />
                    <span className="text-xs font-bold text-zinc-300">PvP Match vs {multiplayerOpponentName || 'Opponent'}</span>
                </div>

                {/* ══════════════════════════════════ */}
                <BattleHUD timer={timer} />

                {/* ══════════════════════════════════ */}
                <div className="flex-1 flex flex-col items-center justify-center w-full relative py-1 md:py-0">
                    {damagePreview > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-1 md:mb-2 px-3 md:px-4 py-0.5 md:py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-[10px] md:text-xs font-mono"
                        >
                            {t('preview.estimated')} ~{damagePreview} {t('preview.damage')}
                        </motion.div>
                    )}
                    <Grid />
                </div>

                {/* ══════════════════════════════════ */}
                <div className="w-full max-w-2xl px-1 md:px-2 flex flex-col items-center gap-1.5 md:gap-3 pb-1 md:pb-2">
                    <Skills />
                    <Hand />

                    <div className="flex gap-1.5 md:gap-2 w-full mt-1">
                        <button
                            onClick={() => { if (confirm('คุณต้องการยอมแพ้และออกจากห้องนี้ใช่หรือไม่?')) resetGame(); }}
                            className="px-3 py-2.5 md:py-3.5 glass-card rounded-xl text-red-400 hover:text-red-300 hover:border-red-500/40 transition-all active:scale-95 flex items-center gap-1"
                        >
                            <Flag size={14} className="md:w-4 md:h-4" />
                        </button>

                        <button
                            onClick={submitWord}
                            disabled={!isPlayerTurn}
                            className={`flex-1 py-2.5 md:py-3.5 rounded-xl font-bold text-sm md:text-base uppercase tracking-widest transition-all ${isPlayerTurn
                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]'
                                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border-2 border-zinc-700/50'
                                }`}
                        >
                            {isPlayerTurn ? 'โจมตี!' : 'รอคู่ต่อสู้...'}
                        </button>

                        <button
                            onClick={handleHint}
                            disabled={!isPlayerTurn}
                            className={`px-3 py-2.5 md:py-3.5 rounded-xl transition-all active:scale-95 ${isPlayerTurn ? 'glass-card text-yellow-400 hover:text-yellow-300 hover:border-yellow-500/40' : 'bg-zinc-800 text-zinc-600 border border-zinc-800'
                                }`}
                        >
                            <Lightbulb size={14} className="md:w-4 md:h-4" />
                        </button>

                        <button
                            onClick={() => setShowHelp(true)}
                            className="px-3 py-2.5 md:py-3.5 glass-card rounded-xl text-blue-400 hover:text-blue-300 hover:border-blue-500/40 transition-all active:scale-95"
                        >
                            <HelpCircle size={14} className="md:w-4 md:h-4" />
                        </button>
                    </div>

                    <HelpModal show={showHelp} onClose={() => setShowHelp(false)} />
                    <SettingsModal show={showSettings} onClose={() => setShowSettings(false)} />
                </div>

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeTile ? (
                        <Tile id={activeTile.id} letter={activeTile.letter} value={activeTile.value}
                            bonus={activeTile.bonus} isWild={activeTile.isWild} rarity={activeTile.rarity} />
                    ) : null}
                </DragOverlay>
            </motion.div>
        </DndContext>
    );
};
