import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { t } from '../../core/i18n';

interface TutorialProps {
    step: number;
    onNext: () => void;
    onSkip: () => void;
    totalSteps: number;
}

const _STEP_HIGHLIGHTS: Record<number, string> = {
    0: 'hand',    // Highlight the hand area
    1: 'grid',    // Highlight the grid
    2: 'cast',    // Highlight cast button
    3: 'skills',  // Highlight skills bar
};

export const Tutorial: React.FC<TutorialProps> = ({ step, onNext, onSkip, totalSteps }) => {
    const isLast = step >= totalSteps - 1;

    const stepKeys: Array<{ title: string; desc: string }> = [
        { title: t('tutorial.step1Title'), desc: t('tutorial.step1Desc') },
        { title: t('tutorial.step2Title'), desc: t('tutorial.step2Desc') },
        { title: t('tutorial.step3Title'), desc: t('tutorial.step3Desc') },
        { title: t('tutorial.step4Title'), desc: t('tutorial.step4Desc') },
    ];

    const current = stepKeys[step] || stepKeys[0];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[80] pointer-events-none"
            >
                {/* Dimmed overlay */}
                <div className="absolute inset-0 bg-black/60 pointer-events-auto" />

                {/* Tutorial Card */}
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md pointer-events-auto"
                >
                    <div className="glass-card rounded-2xl p-6 border-indigo-500/30 border-2 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
                        {/* Step indicator */}
                        <div className="flex gap-1.5 mb-4 justify-center">
                            {Array.from({ length: totalSteps }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === step
                                        ? 'w-8 bg-indigo-400'
                                        : i < step
                                            ? 'w-4 bg-indigo-600'
                                            : 'w-4 bg-zinc-700'}`}
                                />
                            ))}
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold text-white mb-2">{current.title}</h3>
                        <p className="text-sm text-zinc-300 leading-relaxed mb-5">{current.desc}</p>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={onSkip}
                                className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 font-bold text-sm hover:bg-zinc-700 transition-all"
                            >
                                {t('tutorial.skip')}
                            </button>
                            <button
                                onClick={onNext}
                                className="flex-1 py-2.5 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                            >
                                {isLast ? t('tutorial.finish') : t('tutorial.next')}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Pulsing highlight arrow pointing to relevant area */}
                {step === 2 && (
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute bottom-[230px] left-1/2 -translate-x-1/2 text-4xl pointer-events-none"
                    >
                        👇
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};
