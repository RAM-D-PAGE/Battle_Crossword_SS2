import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useSettingsStore, FontSize, Difficulty } from '../../store/useSettingsStore';
import { useGameStore } from '../../store/useGameStore';
import { t } from '../../core/i18n';

interface SettingsModalProps {
    show: boolean;
    onClose: () => void;
}

const ToggleButton: React.FC<{
    active: boolean;
    onClick: () => void;
    label: string;
}> = ({ active, onClick, label }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${active
            ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
    >
        {label}
    </button>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({ show, onClose }) => {
    const settings = useSettingsStore();

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
                        className="glass-card rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">{t('settings.title')}</h3>
                            <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* Font Size */}
                            <div>
                                <label className="text-sm font-bold text-zinc-300 mb-2 block">{t('settings.fontSize')}</label>
                                <div className="flex gap-2">
                                    {(['normal', 'large', 'xlarge'] as FontSize[]).map(size => (
                                        <ToggleButton
                                            key={size}
                                            active={settings.fontSize === size}
                                            onClick={() => settings.setFontSize(size)}
                                            label={t(`settings.font${size.charAt(0).toUpperCase() + size.slice(1)}` as any)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Timer */}
                            <div>
                                <label className="text-sm font-bold text-zinc-300 mb-2 block">{t('settings.timer')}</label>
                                <div className="flex gap-2">
                                    <ToggleButton
                                        active={settings.timerEnabled}
                                        onClick={() => settings.setTimerEnabled(true)}
                                        label={t('settings.timerOn')}
                                    />
                                    <ToggleButton
                                        active={!settings.timerEnabled}
                                        onClick={() => settings.setTimerEnabled(false)}
                                        label={t('settings.timerOff')}
                                    />
                                </div>
                            </div>

                            {/* Difficulty */}
                            <div>
                                <label className="text-sm font-bold text-zinc-300 mb-2 block">{t('settings.difficulty')}</label>
                                <div className="flex gap-2">
                                    {(['easy', 'normal', 'hard'] as Difficulty[]).map(diff => (
                                        <ToggleButton
                                            key={diff}
                                            active={settings.difficulty === diff}
                                            onClick={() => settings.setDifficulty(diff)}
                                            label={t(`settings.${diff}` as any)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Language */}
                            <div>
                                <label className="text-sm font-bold text-zinc-300 mb-2 block">{t('settings.language')}</label>
                                <div className="flex gap-2">
                                    <ToggleButton
                                        active={settings.language === 'en'}
                                        onClick={() => settings.setLanguageSetting('en')}
                                        label="🇬🇧 English"
                                    />
                                    <ToggleButton
                                        active={settings.language === 'th'}
                                        onClick={() => settings.setLanguageSetting('th')}
                                        label="🇹🇭 ไทย"
                                    />
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="space-y-3">
                                {/* High Contrast */}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-zinc-300">{t('settings.highContrast')}</span>
                                    <button
                                        onClick={() => settings.setHighContrast(!settings.highContrast)}
                                        className={`w-14 h-8 rounded-full transition-all relative ${settings.highContrast ? 'bg-indigo-500' : 'bg-zinc-700'}`}
                                    >
                                        <motion.div
                                            className="w-6 h-6 bg-white rounded-full absolute top-1"
                                            animate={{ left: settings.highContrast ? '1.75rem' : '0.25rem' }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    </button>
                                </div>

                                {/* Full Game Mode (Inverted logic for better UX) */}
                                <div className="pt-2 border-t border-zinc-800">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-bold text-zinc-300">{t('settings.elderlyMode')}</span>
                                        <button
                                            onClick={() => {
                                                if (settings.elderlyMode) {
                                                    settings.disableElderlyMode();
                                                    // useGameStore.getState().resetGame(); // Optional: don't reset unless necessary
                                                    onClose();
                                                } else {
                                                    settings.enableElderlyMode();
                                                }
                                            }}
                                            className={`w-14 h-8 rounded-full transition-all relative ${!settings.elderlyMode ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-zinc-700'}`}
                                        >
                                            <motion.div
                                                className="w-6 h-6 bg-white rounded-full absolute top-1"
                                                animate={{ left: !settings.elderlyMode ? '1.75rem' : '0.25rem' }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            />
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-zinc-500">{t('settings.elderlyModeDesc')}</p>
                                </div>

                                {/* Tap to Place */}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-zinc-300">{t('settings.tapToPlace')}</span>
                                    <button
                                        onClick={() => settings.setTapToPlace(!settings.tapToPlace)}
                                        className={`w-14 h-8 rounded-full transition-all relative ${settings.tapToPlace ? 'bg-indigo-500' : 'bg-zinc-700'}`}
                                    >
                                        <motion.div
                                            className="w-6 h-6 bg-white rounded-full absolute top-1"
                                            animate={{ left: settings.tapToPlace ? '1.75rem' : '0.25rem' }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    </button>
                                </div>

                                {/* Screen Shake */}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-zinc-300">{t('settings.screenShake')}</span>
                                    <button
                                        onClick={() => settings.setScreenShake(!settings.screenShakeEnabled)}
                                        className={`w-14 h-8 rounded-full transition-all relative ${settings.screenShakeEnabled ? 'bg-indigo-500' : 'bg-zinc-700'}`}
                                    >
                                        <motion.div
                                            className="w-6 h-6 bg-white rounded-full absolute top-1"
                                            animate={{ left: settings.screenShakeEnabled ? '1.75rem' : '0.25rem' }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    </button>
                                </div>

                                {/* Auto Sort */}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-zinc-300">{t('settings.autoSort')}</span>
                                    <button
                                        onClick={() => settings.setAutoSort(!settings.autoSort)}
                                        className={`w-14 h-8 rounded-full transition-all relative ${settings.autoSort ? 'bg-indigo-500' : 'bg-zinc-700'}`}
                                    >
                                        <motion.div
                                            className="w-6 h-6 bg-white rounded-full absolute top-1"
                                            animate={{ left: settings.autoSort ? '1.75rem' : '0.25rem' }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="mt-6 w-full py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm uppercase tracking-widest hover:bg-indigo-400 transition-all"
                        >
                            {t('settings.close')}
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
