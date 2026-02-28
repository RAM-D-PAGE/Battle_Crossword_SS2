import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { t } from '../../core/i18n';

interface HelpModalProps {
    show: boolean;
    onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ show, onClose }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        onClick={e => e.stopPropagation()}
                        className="glass-card rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto text-sm"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">{t('help.title')}</h3>
                            <button onClick={onClose} className="text-zinc-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-3 text-zinc-300">
                            <div>
                                <h4 className="font-bold text-indigo-300 mb-1">{t('help.battleTitle')}</h4>
                                <p>{t('help.battleDesc')}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo-300 mb-1">{t('help.scoringTitle')}</h4>
                                <p>{t('help.scoringDesc')}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo-300 mb-1">{t('help.elementsTitle')}</h4>
                                <p>{t('help.elementsDesc1')}</p>
                                <p>{t('help.elementsDesc2')}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo-300 mb-1">{t('help.classesTitle')}</h4>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                    <li><b>Scribe 📜</b> — 5+ letter words: 1.3x DMG + 15 MP</li>
                                    <li><b>Barbarian 🪓</b> — 3-4 letter words: 1.5x DMG</li>
                                    <li><b>Rogue 🗡️</b> — 25% crit, rare letters 2x</li>
                                    <li><b>Cleric ✝️</b> — Heal 6 HP per word</li>
                                    <li><b>Paladin ⚔️</b> — Light 1.5x, +5 HP/word</li>
                                    <li><b>Warlock 🔮</b> — Dark 1.5x, +10% DMG→MP</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo-300 mb-1">{t('help.tipsTitle')}</h4>
                                <ul className="list-disc list-inside text-xs space-y-1">
                                    <li>{t('help.tip1')}</li>
                                    <li>{t('help.tip2')}</li>
                                    <li>{t('help.tip3')}</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo-300 mb-1">{t('help.keyboardTitle')}</h4>
                                <div className="text-xs space-y-1">
                                    <div className="flex justify-between"><span>{t('help.keyType')}</span><kbd className="px-1.5 py-0.5 bg-zinc-700 rounded text-zinc-300 font-mono">A-Z</kbd></div>
                                    <div className="flex justify-between"><span>{t('help.keyRemove')}</span><kbd className="px-1.5 py-0.5 bg-zinc-700 rounded text-zinc-300 font-mono">Backspace</kbd></div>
                                    <div className="flex justify-between"><span>{t('help.keyCast')}</span><kbd className="px-1.5 py-0.5 bg-zinc-700 rounded text-zinc-300 font-mono">Enter</kbd></div>
                                    <div className="flex justify-between"><span>{t('help.keySkill')}</span><kbd className="px-1.5 py-0.5 bg-zinc-700 rounded text-zinc-300 font-mono">1-6</kbd></div>
                                    <div className="flex justify-between"><span>{t('help.keyHelp')}</span><kbd className="px-1.5 py-0.5 bg-zinc-700 rounded text-zinc-300 font-mono">Esc</kbd></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
