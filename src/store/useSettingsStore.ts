import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, setLanguage } from '../core/i18n';

// ═══════════════════════════════════════
// Settings Types
// ═══════════════════════════════════════

export type FontSize = 'normal' | 'large' | 'xlarge';
export type Difficulty = 'easy' | 'normal' | 'hard';

interface SettingsState {
    fontSize: FontSize;
    timerEnabled: boolean;
    difficulty: Difficulty;
    language: Language;
    highContrast: boolean;
    tapToPlace: boolean;
    screenShakeEnabled: boolean;
    autoSort: boolean;
    showTutorial: boolean;
    elderlyMode: boolean;

    // Actions
    setFontSize: (size: FontSize) => void;
    setTimerEnabled: (enabled: boolean) => void;
    setDifficulty: (difficulty: Difficulty) => void;
    setLanguageSetting: (lang: Language) => void;
    setHighContrast: (enabled: boolean) => void;
    setTapToPlace: (enabled: boolean) => void;
    setScreenShake: (enabled: boolean) => void;
    setAutoSort: (enabled: boolean) => void;
    setShowTutorial: (show: boolean) => void;
    enableElderlyMode: () => void;
    disableElderlyMode: () => void;
}

// ═══════════════════════════════════════
// Difficulty Multipliers
// ═══════════════════════════════════════

export const DIFFICULTY_CONFIG = {
    easy: {
        enemyHpMultiplier: 0.6,
        enemyDamageMultiplier: 0.5,
        timerDuration: 120,
        hintAvailable: true,
    },
    normal: {
        enemyHpMultiplier: 1.0,
        enemyDamageMultiplier: 1.0,
        timerDuration: 60,
        hintAvailable: true,
    },
    hard: {
        enemyHpMultiplier: 1.5,
        enemyDamageMultiplier: 1.5,
        timerDuration: 30,
        hintAvailable: false,
    }
};

// ═══════════════════════════════════════
// Font Size CSS Variables
// ═══════════════════════════════════════

export const FONT_SIZE_CONFIG = {
    normal: {
        '--font-xs': '9px',
        '--font-sm': '12px',
        '--font-base': '14px',
        '--font-lg': '16px',
        '--font-xl': '20px',
        '--font-2xl': '24px',
        '--font-3xl': '30px',
        '--tile-size': '56px',
        '--tile-size-md': '64px',
        '--slot-size': '56px',
        '--slot-size-md': '72px',
        '--skill-size': '56px',
        '--skill-size-md': '64px',
    },
    large: {
        '--font-xs': '12px',
        '--font-sm': '14px',
        '--font-base': '16px',
        '--font-lg': '20px',
        '--font-xl': '24px',
        '--font-2xl': '30px',
        '--font-3xl': '36px',
        '--tile-size': '64px',
        '--tile-size-md': '76px',
        '--slot-size': '64px',
        '--slot-size-md': '80px',
        '--skill-size': '64px',
        '--skill-size-md': '72px',
    },
    xlarge: {
        '--font-xs': '14px',
        '--font-sm': '16px',
        '--font-base': '20px',
        '--font-lg': '24px',
        '--font-xl': '30px',
        '--font-2xl': '36px',
        '--font-3xl': '42px',
        '--tile-size': '76px',
        '--tile-size-md': '88px',
        '--slot-size': '76px',
        '--slot-size-md': '92px',
        '--skill-size': '72px',
        '--skill-size-md': '80px',
    }
};

// ═══════════════════════════════════════
// Store
// ═══════════════════════════════════════

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            fontSize: 'normal',
            timerEnabled: true,
            difficulty: 'normal',
            language: 'th',
            highContrast: false,
            tapToPlace: true,
            screenShakeEnabled: true,
            autoSort: false,
            showTutorial: true,
            elderlyMode: false,

            setFontSize: (size) => set({ fontSize: size }),
            setTimerEnabled: (enabled) => set({ timerEnabled: enabled }),
            setDifficulty: (difficulty) => set({ difficulty }),
            setLanguageSetting: (lang) => {
                setLanguage(lang);
                set({ language: lang });
            },
            setHighContrast: (enabled) => set({ highContrast: enabled }),
            setTapToPlace: (enabled) => set({ tapToPlace: enabled }),
            setScreenShake: (enabled) => set({ screenShakeEnabled: enabled }),
            setAutoSort: (enabled) => set({ autoSort: enabled }),
            setShowTutorial: (show) => set({ showTutorial: show }),
            enableElderlyMode: () => set({
                elderlyMode: true,
                fontSize: 'xlarge',
                highContrast: true,
                difficulty: 'easy',
                timerEnabled: false,
                tapToPlace: true,
                screenShakeEnabled: false,
                autoSort: true,
            }),
            disableElderlyMode: () => set({
                elderlyMode: false,
                fontSize: 'normal',
                highContrast: false,
                difficulty: 'normal',
                timerEnabled: true,
                tapToPlace: false,
                screenShakeEnabled: true,
                autoSort: false,
            }),
        }),
        {
            name: 'battle-crossword-settings',
        }
    )
);
