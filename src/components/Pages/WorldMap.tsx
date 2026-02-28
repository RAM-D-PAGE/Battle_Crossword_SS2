import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORY_CHAPTERS } from '../../core/data/StoryData';
import { ENEMIES } from '../../core/data/Enemies';
import { useGameStore } from '../../store/useGameStore';
import { useSettingsStore } from '../../store/useSettingsStore';

interface WorldMapProps {
    onStartBattle: (enemyId: string) => void;
    onBack: () => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ onStartBattle, onBack }) => {
    const { currentEnemyIndex } = useGameStore();
    const { language } = useSettingsStore();
    const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
    const [showDialogue, setShowDialogue] = useState(false);
    const [dialogueIndex, setDialogueIndex] = useState(0);

    const handleStageClick = (enemyIdx: number) => {
        if (enemyIdx > currentEnemyIndex) return; // Locked
        const enemy = ENEMIES[enemyIdx];
        if (!enemy) return;
        onStartBattle(enemy.id);
    };

    const startChapter = (chapterId: number) => {
        setSelectedChapter(chapterId);
        setShowDialogue(true);
        setDialogueIndex(0);
    };

    const nextDialogue = () => {
        const chapter = STORY_CHAPTERS.find(c => c.id === selectedChapter);
        if (!chapter) return;
        if (dialogueIndex < chapter.dialogue.length - 1) {
            setDialogueIndex(d => d + 1);
        } else {
            setShowDialogue(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-indigo-950 to-zinc-950 text-white p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button onClick={onBack} className="glass-card px-4 py-2 rounded-xl text-sm hover:bg-white/10 transition">
                    ← Back
                </button>
                <h1 className="text-2xl font-black tracking-wide">🗺️ World Map</h1>
                <div className="w-20" />
            </div>

            {/* Chapters */}
            <div className="flex flex-col gap-6 max-w-lg mx-auto">
                {STORY_CHAPTERS.map((chapter) => {
                    const firstStageIdx = chapter.stages[0];
                    const isUnlocked = currentEnemyIndex >= firstStageIdx;
                    const isCompleted = currentEnemyIndex > chapter.stages[chapter.stages.length - 1];

                    return (
                        <motion.div
                            key={chapter.id}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: chapter.id * 0.1 }}
                            className={`glass-card rounded-2xl p-4 border ${isCompleted ? 'border-emerald-500/30' :
                                    isUnlocked ? 'border-amber-500/30' :
                                        'border-zinc-700/30 opacity-50'
                                }`}
                        >
                            {/* Chapter Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-3xl">{chapter.icon}</span>
                                <div className="flex-1">
                                    <h2 className="text-lg font-bold">
                                        Ch.{chapter.id}: {language === 'th' ? chapter.titleTh : chapter.title}
                                    </h2>
                                    <p className="text-xs text-zinc-400">
                                        {language === 'th' ? chapter.descriptionTh : chapter.description}
                                    </p>
                                </div>
                                {isCompleted && <span className="text-2xl">✅</span>}
                                {isUnlocked && !isCompleted && (
                                    <button
                                        onClick={() => startChapter(chapter.id)}
                                        className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1.5 rounded-xl text-xs font-bold
                                                   hover:from-amber-400 hover:to-orange-400 transition shadow-lg shadow-amber-500/25"
                                    >
                                        📜 Story
                                    </button>
                                )}
                            </div>

                            {/* Stages */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                {chapter.stages.map((enemyIdx, stageNum) => {
                                    const enemy = ENEMIES[enemyIdx];
                                    if (!enemy) return null;
                                    const isStageUnlocked = currentEnemyIndex >= enemyIdx;
                                    const isCurrent = currentEnemyIndex === enemyIdx;
                                    const isStageDone = currentEnemyIndex > enemyIdx;

                                    return (
                                        <React.Fragment key={enemyIdx}>
                                            {stageNum > 0 && (
                                                <div className={`w-6 h-0.5 ${isStageDone ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
                                            )}
                                            <button
                                                onClick={() => handleStageClick(enemyIdx)}
                                                disabled={!isStageUnlocked}
                                                className={`flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-xl transition
                                                    ${isCurrent ? 'bg-amber-500/20 border border-amber-500/50 animate-pulse' :
                                                        isStageDone ? 'bg-emerald-500/10 border border-emerald-500/30' :
                                                            isStageUnlocked ? 'bg-white/5 hover:bg-white/10 border border-zinc-700/30' :
                                                                'bg-zinc-900/50 cursor-not-allowed border border-zinc-800/30'}`}
                                            >
                                                <span className="text-xl">
                                                    {isStageDone ? '✅' : isStageUnlocked ? (enemy.icon || '👹') : '🔒'}
                                                </span>
                                                <span className={`text-[10px] font-bold ${isCurrent ? 'text-amber-300' : 'text-zinc-400'}`}>
                                                    {enemy.name.split(' ')[0]}
                                                </span>
                                            </button>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Story Dialogue Modal */}
            <AnimatePresence>
                {showDialogue && selectedChapter && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
                        onClick={nextDialogue}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="glass-card rounded-2xl p-6 max-w-md w-full border border-amber-500/30"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {(() => {
                                const chapter = STORY_CHAPTERS.find(c => c.id === selectedChapter);
                                if (!chapter || !chapter.dialogue[dialogueIndex]) return null;
                                const d = chapter.dialogue[dialogueIndex];
                                return (
                                    <>
                                        <h3 className="text-amber-400 font-bold text-lg mb-1">
                                            {chapter.icon} {language === 'th' ? chapter.titleTh : chapter.title}
                                        </h3>
                                        <div className="bg-zinc-900/50 rounded-xl p-4 mb-4">
                                            <p className="text-white text-sm leading-relaxed">
                                                {language === 'th' ? d.textTh : `${d.speaker}: ${d.text}`}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-zinc-500 text-xs">
                                                {dialogueIndex + 1}/{chapter.dialogue.length}
                                            </span>
                                            <button
                                                onClick={nextDialogue}
                                                className="bg-amber-500 hover:bg-amber-400 px-6 py-2 rounded-xl text-black font-bold text-sm transition"
                                            >
                                                {dialogueIndex < chapter.dialogue.length - 1 ? 'Next →' : 'Close ✓'}
                                            </button>
                                        </div>
                                    </>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WorldMap;
