import { ClassData } from '../types';

export const CLASSES: ClassData[] = [
    {
        id: 'scribe',
        name: 'Scribe',
        description: 'Master of long words. Rewarded for spelling complex words.',
        baseHp: 80,
        baseMp: 120,
        passiveDescription: 'Long words (5+) deal 1.3x damage and restore +15 MP.',
        icon: '📜',
        element: 'Arcane',
        startingSkills: ['shuffle', 'fireball', 'word_mastery']
    },
    {
        id: 'barbarian',
        name: 'Barbarian',
        description: 'Fierce warrior. Quick, short attacks deal devastating damage.',
        baseHp: 150,
        baseMp: 60,
        passiveDescription: 'Short words (3-4 letters) deal 1.5x damage.',
        icon: '🪓',
        element: 'Fire',
        startingSkills: ['fireball', 'berserk', 'shuffle']
    },
    {
        id: 'rogue',
        name: 'Rogue',
        description: 'Cunning trickster. Deadly critical strikes and rare letter bonus.',
        baseHp: 100,
        baseMp: 90,
        passiveDescription: '25% crit rate. Rare letters (J,K,Q,X,Z) deal 2x damage.',
        icon: '🗡️',
        element: 'Dark',
        startingSkills: ['shadow_bolt', 'backstab', 'shuffle']
    },
    {
        id: 'cleric',
        name: 'Cleric',
        description: 'Holy healer. Sustains through the power of words.',
        baseHp: 120,
        baseMp: 100,
        passiveDescription: 'Heal 6 HP every time you submit a valid word.',
        icon: '✝️',
        element: 'Light',
        startingSkills: ['heal', 'mass_heal', 'shuffle']
    },
    {
        id: 'paladin',
        name: 'Paladin',
        description: 'Holy knight. Balanced offense/defense with Light affinity.',
        baseHp: 140,
        baseMp: 80,
        passiveDescription: 'Light words deal 1.5x damage. Heal 5 HP per word.',
        icon: '⚔️',
        element: 'Light',
        startingSkills: ['heal', 'divine_shield', 'lightning_bolt']
    },
    {
        id: 'warlock',
        name: 'Warlock',
        description: 'Dark sorcerer. Sacrifices HP for devastating power and MP regen.',
        baseHp: 70,
        baseMp: 150,
        passiveDescription: 'Dark bonus damage. +10% damage as MP on every attack.',
        icon: '🔮',
        element: 'Dark',
        startingSkills: ['shadow_bolt', 'drain_life', 'soul_harvest']
    },
    // ═══════════════════════════════════════
    // NEW CLASSES
    // ═══════════════════════════════════════
    {
        id: 'ranger',
        name: 'Ranger',
        description: 'Nature hunter. Bonus damage from vowels and quick reflexes.',
        baseHp: 110,
        baseMp: 85,
        passiveDescription: 'Vowels (A,E,I,O,U) in words give +2 bonus damage each.',
        icon: '🏹',
        element: 'Nature',
        startingSkills: ['natures_blessing', 'arrow_volley', 'shuffle']
    },
    {
        id: 'chronomancer',
        name: 'Chronomancer',
        description: 'Time mage. Manipulates cooldowns and gains extra turns.',
        baseHp: 85,
        baseMp: 130,
        passiveDescription: 'All skill cooldowns reduced by 20%. +5s to timer.',
        icon: '⏳',
        element: 'Arcane',
        startingSkills: ['shuffle', 'lightning_bolt', 'time_warp']
    },
    {
        id: 'necromancer',
        name: 'Necromancer',
        description: 'Master of death. Converts HP into raw destructive power.',
        baseHp: 90,
        baseMp: 110,
        passiveDescription: 'Each enemy defeated restores 20 HP. Words with 4+ unique letters deal +15% damage.',
        icon: '💀',
        element: 'Dark',
        startingSkills: ['shadow_bolt', 'blood_pact', 'drain_life']
    },
    {
        id: 'monk',
        name: 'Monk',
        description: 'Balanced fighter. Inner peace grants steady damage and healing.',
        baseHp: 130,
        baseMp: 70,
        passiveDescription: 'Heal 3 HP per turn. Words with no repeated letters deal +20% damage.',
        icon: '🧘',
        element: 'Nature',
        startingSkills: ['natures_blessing', 'earth_shatter', 'heal']
    },
];
