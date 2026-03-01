import { useState, useEffect, useCallback } from 'react';
import {
    DndContext,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragEndEvent,
    useSensor,
    useSensors,
    PointerSensor,
    TouchSensor
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';

import { Skills } from './components/Game/Skills';
import { Hand } from './components/Game/Hand';
import { DamagePopup } from './components/Game/DamagePopup';
import { Grid } from './components/Game/Grid';
import { Tile } from './components/Game/Tile';
import { BattleHUD } from './components/Game/BattleHUD';
import { GameOverOverlay } from './components/Game/GameOverOverlay';
import { HelpModal } from './components/Game/HelpModal';
import { SettingsModal } from './components/Game/SettingsModal';
import { Tutorial } from './components/Game/Tutorial';

import { MainMenu } from './components/Pages/MainMenu';
import { ClassSelect } from './components/Pages/ClassSelect';
import { MultiplayerLobby } from './components/Pages/MultiplayerLobby';
import { Bestiary } from './components/Pages/Bestiary';
import { Leaderboard } from './components/Pages/Leaderboard';
import { SkillShop } from './components/Pages/SkillShop';
import { Inventory } from './components/Pages/Inventory';
import WorldMap from './components/Pages/WorldMap';
import { MultiplayerSync } from './components/Game/MultiplayerSync';
import AchievementsPage from './components/Pages/AchievementsPage';

import { useGameStore } from './store/useGameStore';
import { useSettingsStore, FONT_SIZE_CONFIG } from './store/useSettingsStore';
import { useGameLoop } from './hooks/useGameLoop';
import { useKeyboard } from './hooks/useKeyboard';
import { TileData } from './core/types';
import { HelpCircle, Flag, Settings, Lightbulb } from 'lucide-react';
import { setLanguage, t } from './core/i18n';
import { findHints } from './core/engine/HintSystem';

type AppPage = 'mainMenu' | 'classSelect' | 'multiplayer' | 'bestiary' | 'leaderboard' | 'shop' | 'inventory' | 'battle' | 'worldMap' | 'achievements';

function App() {
    const [currentPage, setCurrentPage] = useState<AppPage>('mainMenu');
    const [activeTile, setActiveTile] = useState<TileData | null>(null);
    const [showHelp, setShowHelp] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [hintText, setHintText] = useState('');
    const [tutorialStep, setTutorialStep] = useState(0);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor)
    );

    const {
        placeTile, returnTileToHand,
        gameStatus, isPlayerTurn,
        popups, removePopup, resetGame,
        hand
    } = useGameStore();

    const {
        fontSize, highContrast, screenShakeEnabled,
        showTutorial, setShowTutorial, language, tapToPlace
    } = useSettingsStore();

    const { timer, message, submitWord, damagePreview, combo } = useGameLoop();

    // Initialize i18n from saved settings
    useEffect(() => {
        setLanguage(language);
    }, [language]);

    // Apply font size CSS variables
    useEffect(() => {
        const config = FONT_SIZE_CONFIG[fontSize];
        const root = document.documentElement;
        Object.entries(config).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }, [fontSize]);

    // Apply high contrast class
    useEffect(() => {
        document.body.classList.toggle('high-contrast', highContrast);
    }, [highContrast]);

    // Sync gameStatus with page routing
    useEffect(() => {
        if (gameStatus === 'battle' || gameStatus === 'victory' || gameStatus === 'defeat' || gameStatus === 'zen') {
            setCurrentPage('battle');
        } else if (gameStatus === 'idle' && currentPage === 'battle') {
            setCurrentPage('mainMenu');
        }
    }, [gameStatus]);

    // Keyboard controls (only during battle)
    useKeyboard(submitWord, showHelp, setShowHelp);

    // Hint handler
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

    // Tutorial handler
    const handleTutorialNext = () => {
        if (tutorialStep >= 3) {
            setShowTutorial(false);
            setTutorialStep(0);
        } else {
            setTutorialStep(s => s + 1);
        }
    };

    const handleTutorialSkip = () => {
        setShowTutorial(false);
        setTutorialStep(0);
    };

    // Page navigation
    const handleNavigate = (page: string) => {
        setCurrentPage(page as AppPage);
    };

    const handleBack = () => {
        setCurrentPage('mainMenu');
    };

    // ══════════════════════════════════
    // PAGE ROUTER
    // ══════════════════════════════════
    if (currentPage === 'mainMenu' && gameStatus === 'idle') {
        return <MainMenu onNavigate={handleNavigate} />;
    }

    if (currentPage === 'classSelect') {
        return <ClassSelect onBack={handleBack} />;
    }

    if (currentPage === 'multiplayer') {
        return <MultiplayerLobby onBack={handleBack} onStartBattle={() => setCurrentPage('battle')} />;
    }

    if (currentPage === 'bestiary') {
        return <Bestiary onBack={handleBack} />;
    }

    if (currentPage === 'leaderboard') {
        return <Leaderboard onBack={handleBack} />;
    }

    if (currentPage === 'shop') {
        return <SkillShop onBack={handleBack} />;
    }

    if (currentPage === 'inventory') {
        return <Inventory onBack={handleBack} />;
    }

    if (currentPage === 'worldMap') {
        return <WorldMap onStartBattle={(enemyId: string) => {
            useGameStore.getState().startBattle(enemyId);
            setCurrentPage('battle');
        }} onBack={handleBack} />;
    }

    if (currentPage === 'achievements') {
        return <AchievementsPage
            stats={{
                totalWordsSpelled: 0,
                longestWord: 0,
                highestCombo: combo || 0,
                totalDamageDealt: 0,
                enemiesDefeated: 0,
                playerLevel: useGameStore.getState().playerLevel,
                goldEarned: useGameStore.getState().gold,
                criticalHits: 0,
                skillsUsed: 0,
                chaptersCompleted: Math.floor(useGameStore.getState().currentEnemyIndex / 4)
            }}
            unlockedIds={[]}
            onBack={handleBack}
        />;
    }

    // ══════════════════════════════════
    // DRAG HANDLERS
    // ══════════════════════════════════
    const handleDragStart = (event: DragStartEvent) => {
        if (tapToPlace) return;
        const { active } = event;
        const tileData = active.data.current as TileData;
        setActiveTile(tileData);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        if (tapToPlace) return;
        const { active, over } = event;
        const tileId = active.id as string;

        if (over) {
            const overId = over.id as string;
            if (overId.startsWith('slot-')) {
                const slotIndex = parseInt(overId.split('-')[1]);
                placeTile(tileId, slotIndex);
            }
        } else {
            returnTileToHand(tileId);
        }
        setActiveTile(null);
    };

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: '0.5' } },
        }),
    };

    // ══════════════════════════════════
    // BATTLE SCREEN
    // ══════════════════════════════════
    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <motion.div
                className="game-bg flex flex-col min-h-[100svh] md:h-[100svh] w-full text-white overflow-y-auto overflow-x-hidden md:overflow-hidden items-center justify-between py-4 px-2 relative pb-10"
                animate={screenShakeEnabled && useGameStore.getState().screenShake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                transition={{ duration: 0.35 }}
            >

                {/* ── Battle Feedback Message ── */}
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.3 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
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

                {/* ── Hint Text ── */}
                <AnimatePresence>
                    {hintText && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-2 rounded-xl bg-indigo-900/80 backdrop-blur-md border border-indigo-400/30 text-indigo-200 font-mono text-sm"
                        >
                            💡 {hintText}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Damage Popups ── */}
                <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                    <AnimatePresence>
                        {popups.map(popup => (
                            <DamagePopup key={popup.id} {...popup} onComplete={removePopup} />
                        ))}
                    </AnimatePresence>
                </div>

                {/* ── Game Over Overlay ── */}
                <GameOverOverlay />

                {/* ── Tutorial Overlay ── */}
                {showTutorial && gameStatus === 'battle' && (
                    <Tutorial
                        step={tutorialStep}
                        onNext={handleTutorialNext}
                        onSkip={handleTutorialSkip}
                        totalSteps={4}
                    />
                )}

                {/* ── Settings button (battle) ── */}
                <button
                    onClick={() => setShowSettings(true)}
                    className="absolute top-2 right-2 z-30 p-2 glass-card rounded-lg text-zinc-400 hover:text-white transition-all"
                    title="Settings"
                >
                    <Settings size={16} />
                </button>

                {/* ══════════════════════════════════ */}
                {/* TOP: Battle HUD                    */}
                {/* ══════════════════════════════════ */}
                <BattleHUD timer={timer} />
                <MultiplayerSync />

                {/* ══════════════════════════════════ */}
                {/* MIDDLE: Grid                       */}
                {/* ══════════════════════════════════ */}
                <div className="flex-1 flex flex-col items-center justify-center w-full relative">
                    {/* Damage Preview */}
                    {damagePreview > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-2 px-4 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs font-mono"
                        >
                            {t('preview.estimated')} ~{damagePreview} {t('preview.damage')}
                        </motion.div>
                    )}
                    <Grid />
                </div>

                {/* ══════════════════════════════════ */}
                {/* BOTTOM: Player Area                */}
                {/* ══════════════════════════════════ */}
                <div className="w-full max-w-2xl px-2 flex flex-col items-center gap-3 pb-2">
                    <Skills />
                    <Hand />

                    {/* Action Buttons */}
                    <div className="flex gap-2 w-full">
                        <button
                            onClick={() => { if (confirm(t('battle.surrenderConfirm'))) resetGame(); }}
                            className="px-3 py-3.5 glass-card rounded-xl text-red-400 hover:text-red-300 hover:border-red-500/40 transition-all active:scale-95 flex items-center gap-1"
                            title={t('battle.surrender')}
                        >
                            <Flag size={16} />
                        </button>
                        <button
                            onClick={submitWord}
                            disabled={!isPlayerTurn}
                            className="flex-1 py-3.5 rounded-xl font-bold text-base uppercase tracking-widest btn-cast"
                        >
                            {t('battle.castSpell')}
                            <span className="text-[9px] opacity-50 ml-2 normal-case tracking-normal">[Enter]</span>
                        </button>
                        <button
                            onClick={handleHint}
                            disabled={!isPlayerTurn}
                            className="px-3 py-3.5 glass-card rounded-xl text-yellow-400 hover:text-yellow-300 hover:border-yellow-500/40 transition-all active:scale-95"
                            title={t('battle.hint')}
                        >
                            <Lightbulb size={16} />
                        </button>
                        <button
                            onClick={() => setShowHelp(true)}
                            className="px-3 py-3.5 glass-card rounded-xl text-blue-400 hover:text-blue-300 hover:border-blue-500/40 transition-all active:scale-95"
                            title={`${t('battle.help')} [Esc]`}
                        >
                            <HelpCircle size={16} />
                        </button>
                    </div>

                    {/* Modals */}
                    <HelpModal show={showHelp} onClose={() => setShowHelp(false)} />
                    <SettingsModal show={showSettings} onClose={() => setShowSettings(false)} />
                </div>

                {/* ── Drag Overlay ── */}
                <DragOverlay dropAnimation={dropAnimation}>
                    {activeTile ? (
                        <Tile id={activeTile.id} letter={activeTile.letter} value={activeTile.value}
                            bonus={activeTile.bonus} isWild={activeTile.isWild} rarity={activeTile.rarity} />
                    ) : null}
                </DragOverlay>
            </motion.div>
        </DndContext>
    );
}

export default App;
