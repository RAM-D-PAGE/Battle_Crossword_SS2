import { ElementType } from '../types';

export interface EnemySpecialAttack {
    name: string;
    effect: 'burn' | 'freeze' | 'poison' | 'none';
    chance: number;    // 0-1 probability per attack
    duration: number;  // turns
}

export interface EnemyData {
    id: string;
    name: string;
    maxHp: number;
    damage: number;
    element: ElementType;
    attackInterval: number;
    description: string;
    icon?: string;
    special?: EnemySpecialAttack;
}

export const ENEMIES: EnemyData[] = [
    // ── Chapter 1: Enchanted Forest ──
    {
        id: 'forest_sprite',
        name: 'Forest Sprite',
        maxHp: 120,
        damage: 6,
        element: 'Nature',
        attackInterval: 5,
        description: 'A mischievous forest spirit. Easy prey.',
        icon: '🧚'
    },
    {
        id: 'slime_king',
        name: 'Slime King',
        maxHp: 200,
        damage: 10,
        element: 'Nature',
        attackInterval: 5,
        description: 'A giant slime that rules the forest. Weak to Fire.',
        icon: '👑',
        special: { name: 'Sticky Sludge', effect: 'poison', chance: 0.2, duration: 2 }
    },
    {
        id: 'wolf_alpha',
        name: 'Wolf Alpha',
        maxHp: 250,
        damage: 12,
        element: 'Neutral',
        attackInterval: 4,
        description: 'Leader of the forest wolf pack.',
        icon: '🐺'
    },
    {
        id: 'treant_elder',
        name: 'Treant Elder',
        maxHp: 350,
        damage: 14,
        element: 'Nature',
        attackInterval: 5,
        description: 'An ancient tree guardian. Very resilient.',
        icon: '🌳',
        special: { name: 'Root Bind', effect: 'freeze', chance: 0.15, duration: 1 }
    },

    // ── Chapter 2: Volcanic Wastes ──
    {
        id: 'fire_imp',
        name: 'Fire Imp',
        maxHp: 200,
        damage: 14,
        element: 'Fire',
        attackInterval: 4,
        description: 'A small demon born from flames.',
        icon: '😈'
    },
    {
        id: 'orc_warlord',
        name: 'Orc Warlord',
        maxHp: 350,
        damage: 15,
        element: 'Fire',
        attackInterval: 4,
        description: 'A brutal warrior with immense strength. Weak to Ice.',
        icon: '👹',
        special: { name: 'Flame Strike', effect: 'burn', chance: 0.25, duration: 3 }
    },
    {
        id: 'magma_golem',
        name: 'Magma Golem',
        maxHp: 450,
        damage: 16,
        element: 'Fire',
        attackInterval: 4,
        description: 'A living boulder of molten rock.',
        icon: '🗿',
        special: { name: 'Lava Splash', effect: 'burn', chance: 0.3, duration: 2 }
    },
    {
        id: 'phoenix_hatchling',
        name: 'Phoenix Hatchling',
        maxHp: 300,
        damage: 18,
        element: 'Fire',
        attackInterval: 3,
        description: 'A baby phoenix that burns eternally.',
        icon: '🐦‍🔥'
    },

    // ── Chapter 3: Frozen Peaks ──
    {
        id: 'ice_wraith',
        name: 'Ice Wraith',
        maxHp: 280,
        damage: 15,
        element: 'Ice',
        attackInterval: 4,
        description: 'A ghostly figure made of pure ice.',
        icon: '👻',
        special: { name: 'Frost Touch', effect: 'freeze', chance: 0.2, duration: 1 }
    },
    {
        id: 'frost_witch',
        name: 'Frost Witch',
        maxHp: 400,
        damage: 18,
        element: 'Ice',
        attackInterval: 4,
        description: 'An ice sorceress who freezes the battlefield.',
        icon: '🧙‍♀️',
        special: { name: 'Blizzard', effect: 'freeze', chance: 0.3, duration: 1 }
    },
    {
        id: 'yeti',
        name: 'Yeti',
        maxHp: 500,
        damage: 20,
        element: 'Ice',
        attackInterval: 4,
        description: 'A massive beast of the frozen peaks.',
        icon: '🦍'
    },
    {
        id: 'crystal_dragon',
        name: 'Crystal Dragon',
        maxHp: 550,
        damage: 22,
        element: 'Ice',
        attackInterval: 3,
        description: 'A dragon made of living crystal. Breathes ice.',
        icon: '🐉',
        special: { name: 'Ice Breath', effect: 'freeze', chance: 0.25, duration: 2 }
    },

    // ── Chapter 4: Storm Citadel ──
    {
        id: 'storm_elemental',
        name: 'Storm Elemental',
        maxHp: 400,
        damage: 20,
        element: 'Thunder',
        attackInterval: 3,
        description: 'Pure electrical energy given form.',
        icon: '⚡'
    },
    {
        id: 'thunder_titan',
        name: 'Thunder Titan',
        maxHp: 550,
        damage: 22,
        element: 'Thunder',
        attackInterval: 3,
        description: 'A colossus born from storms. Weak to Nature.',
        icon: '🗽',
        special: { name: 'Static Shock', effect: 'burn', chance: 0.2, duration: 2 }
    },
    {
        id: 'sky_serpent',
        name: 'Sky Serpent',
        maxHp: 480,
        damage: 25,
        element: 'Thunder',
        attackInterval: 3,
        description: 'A serpent that rides the lightning.',
        icon: '🐍',
        special: { name: 'Thunder Coil', effect: 'poison', chance: 0.2, duration: 3 }
    },
    {
        id: 'valkyrie',
        name: 'Valkyrie',
        maxHp: 600,
        damage: 24,
        element: 'Light',
        attackInterval: 3,
        description: 'A warrior angel of justice and thunder.',
        icon: '👼'
    },

    // ── Chapter 5: The Void ──
    {
        id: 'shadow_lich',
        name: 'Shadow Lich',
        maxHp: 600,
        damage: 20,
        element: 'Dark',
        attackInterval: 3,
        description: 'An undead sorcerer who drains your soul.',
        icon: '💀',
        special: { name: 'Soul Drain', effect: 'poison', chance: 0.3, duration: 3 }
    },
    {
        id: 'ancient_dragon',
        name: 'Ancient Dragon',
        maxHp: 700,
        damage: 25,
        element: 'Dark',
        attackInterval: 3,
        description: 'A legendary beast of the void. Weak to Light.',
        icon: '🐲',
        special: { name: 'Shadow Flame', effect: 'burn', chance: 0.3, duration: 3 }
    },
    {
        id: 'void_herald',
        name: 'Void Herald',
        maxHp: 800,
        damage: 28,
        element: 'Arcane',
        attackInterval: 2,
        description: 'The herald of the final emperor.',
        icon: '👁️',
        special: { name: 'Mind Break', effect: 'poison', chance: 0.35, duration: 3 }
    },
    {
        id: 'void_emperor',
        name: 'Void Emperor',
        maxHp: 1200,
        damage: 35,
        element: 'Arcane',
        attackInterval: 2,
        description: 'The ruler of the void. The final test.',
        icon: '🌀',
        special: { name: 'Oblivion', effect: 'burn', chance: 0.4, duration: 3 }
    }
];
