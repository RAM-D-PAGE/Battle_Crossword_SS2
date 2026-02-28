export type ElementType = 'Neutral' | 'Fire' | 'Ice' | 'Thunder' | 'Nature' | 'Arcane' | 'Light' | 'Dark';

export type SkillType = 'active' | 'passive';

export interface ClassData {
    id: string;
    name: string;
    description: string;
    baseHp: number;
    baseMp: number;
    passiveDescription: string;
    icon: string;
    startingSkills: string[]; // Skill IDs granted at start
    element: ElementType;     // Primary element affinity
}

export interface SkillData {
    id: string;
    name: string;
    description: string;
    element: ElementType;
    manaCost: number;
    cooldown: number;
    effectType: 'Damage' | 'Heal' | 'Buff' | 'Debuff' | 'Utility';
    value: number;
    skillType: SkillType;           // 'active' or 'passive'
    classRestriction?: string;      // Only this class can equip (undefined = universal)
    tier: number;                   // 1 = basic, 2 = advanced, 3 = ultimate
    cost: number;                   // Gold cost to buy from shop
    icon: string;                   // Emoji icon
    passiveEffect?: string;         // Description of passive effect (for passive skills)
}

export interface TileData {
    id: string;
    letter: string;
    value: number;
    element?: ElementType;
    bonus?: '2L' | '3L' | '2W' | '3W';  // Letter/Word multiplier
    isWild?: boolean;                      // Wildcard tile (★)
    rarity?: 'common' | 'rare' | 'epic';  // Tile rarity
}

export interface InventoryItem {
    id: string;
    type: 'skill' | 'weapon' | 'accessory';
    itemId: string;   // References a SkillData.id, WeaponData.id, etc.
    equipped: boolean;
    slot?: number;     // Which slot it's equipped in
}

export interface WeaponData {
    id: string;
    name: string;
    description: string;
    icon: string;
    element: ElementType;
    bonusDamage: number;
    bonusMp: number;
    tier: number;
    cost: number;
    passiveEffect?: string;
}
