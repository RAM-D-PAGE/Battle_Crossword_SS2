// ═══════════════════════════════════════════════════
// Achievements System
// ═══════════════════════════════════════════════════

export interface Achievement {
    id: string;
    name: string;
    nameTh: string;
    description: string;
    descriptionTh: string;
    icon: string;
    condition: (stats: GameStats) => boolean;
    reward?: { gold: number };
}

export interface GameStats {
    totalWordsSpelled: number;
    longestWord: number;
    highestCombo: number;
    totalDamageDealt: number;
    enemiesDefeated: number;
    playerLevel: number;
    goldEarned: number;
    criticalHits: number;
    skillsUsed: number;
    chaptersCompleted: number;
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_word',
        name: 'First Spell',
        nameTh: 'คาถาแรก',
        description: 'Spell your first word',
        descriptionTh: 'สะกดคำแรกของคุณ',
        icon: '✨',
        condition: (s) => s.totalWordsSpelled >= 1,
        reward: { gold: 50 }
    },
    {
        id: 'wordsmith',
        name: 'Wordsmith',
        nameTh: 'นักสะกดคำ',
        description: 'Spell 50 words total',
        descriptionTh: 'สะกดคำ 50 คำ',
        icon: '📖',
        condition: (s) => s.totalWordsSpelled >= 50,
        reward: { gold: 200 }
    },
    {
        id: 'linguist',
        name: 'Linguist',
        nameTh: 'นักภาษาศาสตร์',
        description: 'Spell 200 words total',
        descriptionTh: 'สะกดคำ 200 คำ',
        icon: '🎓',
        condition: (s) => s.totalWordsSpelled >= 200,
        reward: { gold: 500 }
    },
    {
        id: 'long_word',
        name: 'Long Word',
        nameTh: 'คำยาว',
        description: 'Spell a 6+ letter word',
        descriptionTh: 'สะกดคำ 6 ตัวอักษรขึ้นไป',
        icon: '📏',
        condition: (s) => s.longestWord >= 6,
        reward: { gold: 100 }
    },
    {
        id: 'master_word',
        name: 'Master Word',
        nameTh: 'คำระดับเทพ',
        description: 'Spell a 7-letter word',
        descriptionTh: 'สะกดคำ 7 ตัวอักษร',
        icon: '👑',
        condition: (s) => s.longestWord >= 7,
        reward: { gold: 300 }
    },
    {
        id: 'combo_3',
        name: 'Combo Starter',
        nameTh: 'เริ่มต้น Combo',
        description: 'Reach a 3x combo',
        descriptionTh: 'ทำ Combo 3 ครั้งติดต่อกัน',
        icon: '🔥',
        condition: (s) => s.highestCombo >= 3,
        reward: { gold: 150 }
    },
    {
        id: 'combo_5',
        name: 'Combo King',
        nameTh: 'ราชา Combo',
        description: 'Reach a 5x combo',
        descriptionTh: 'ทำ Combo 5 ครั้งติดต่อกัน',
        icon: '💥',
        condition: (s) => s.highestCombo >= 5,
        reward: { gold: 500 }
    },
    {
        id: 'first_kill',
        name: 'Monster Slayer',
        nameTh: 'นักฆ่ามอนสเตอร์',
        description: 'Defeat your first enemy',
        descriptionTh: 'กำจัดศัตรูตัวแรก',
        icon: '⚔️',
        condition: (s) => s.enemiesDefeated >= 1,
        reward: { gold: 100 }
    },
    {
        id: 'hunter',
        name: 'Hunter',
        nameTh: 'นักล่า',
        description: 'Defeat 10 enemies',
        descriptionTh: 'กำจัดศัตรู 10 ตัว',
        icon: '🏹',
        condition: (s) => s.enemiesDefeated >= 10,
        reward: { gold: 300 }
    },
    {
        id: 'level_5',
        name: 'Growing Strong',
        nameTh: 'เติบโตแข็งแกร่ง',
        description: 'Reach player level 5',
        descriptionTh: 'เลเวลผู้เล่นถึง 5',
        icon: '⭐',
        condition: (s) => s.playerLevel >= 5,
        reward: { gold: 200 }
    },
    {
        id: 'level_10',
        name: 'Veteran',
        nameTh: 'ทหารผ่านศึก',
        description: 'Reach player level 10',
        descriptionTh: 'เลเวลผู้เล่นถึง 10',
        icon: '🏅',
        condition: (s) => s.playerLevel >= 10,
        reward: { gold: 500 }
    },
    {
        id: 'critical_master',
        name: 'Critical Master',
        nameTh: 'เจ้าแห่ง Critical',
        description: 'Land 10 critical hits',
        descriptionTh: 'โจมตี Critical 10 ครั้ง',
        icon: '💎',
        condition: (s) => s.criticalHits >= 10,
        reward: { gold: 200 }
    },
    {
        id: 'gold_hoarder',
        name: 'Gold Hoarder',
        nameTh: 'สะสมทอง',
        description: 'Earn 5,000 gold total',
        descriptionTh: 'หาทอง 5,000 ทั้งหมด',
        icon: '💰',
        condition: (s) => s.goldEarned >= 5000,
        reward: { gold: 1000 }
    },
    {
        id: 'chapter_1',
        name: 'Forest Cleared',
        nameTh: 'ผ่านป่า',
        description: 'Complete Chapter 1',
        descriptionTh: 'ผ่านด่านบทที่ 1',
        icon: '🌲',
        condition: (s) => s.chaptersCompleted >= 1,
        reward: { gold: 300 }
    },
    {
        id: 'final_boss',
        name: 'Void Conqueror',
        nameTh: 'ผู้พิชิตความว่างเปล่า',
        description: 'Defeat the Void Emperor',
        descriptionTh: 'กำจัดจักรพรรดิความว่างเปล่า',
        icon: '🌀',
        condition: (s) => s.chaptersCompleted >= 5,
        reward: { gold: 2000 }
    }
];
