import { WeaponData } from '../types';

export const WEAPONS: WeaponData[] = [
    // ══════════════════════════════
    // TIER 1 — Starter
    // ══════════════════════════════
    {
        id: 'wooden_staff', name: 'Wooden Staff', icon: '🪄',
        description: 'A simple wooden staff. +2 damage per word.',
        element: 'Neutral', bonusDamage: 2, bonusMp: 0,
        tier: 1, cost: 0
    },
    {
        id: 'rusty_sword', name: 'Rusty Sword', icon: '🗡️',
        description: 'An old but reliable blade. +3 damage per word.',
        element: 'Neutral', bonusDamage: 3, bonusMp: 0,
        tier: 1, cost: 100
    },
    {
        id: 'mana_crystal', name: 'Mana Crystal', icon: '💎',
        description: 'A crystal that amplifies magic. +5 MP per word.',
        element: 'Arcane', bonusDamage: 0, bonusMp: 5,
        tier: 1, cost: 120
    },
    // ══════════════════════════════
    // TIER 2 — Advanced
    // ══════════════════════════════
    {
        id: 'flame_sword', name: 'Flame Sword', icon: '🔥',
        description: 'A sword engulfed in fire. +5 damage, Fire bonus.',
        element: 'Fire', bonusDamage: 5, bonusMp: 0,
        tier: 2, cost: 300,
        passiveEffect: 'Fire words deal +20% damage.'
    },
    {
        id: 'frost_wand', name: 'Frost Wand', icon: '🧊',
        description: 'A wand of eternal ice. +4 damage, +3 MP.',
        element: 'Ice', bonusDamage: 4, bonusMp: 3,
        tier: 2, cost: 350
    },
    {
        id: 'thunder_hammer', name: 'Thunder Hammer', icon: '🔨',
        description: 'A hammer that crackles with lightning. +6 damage.',
        element: 'Thunder', bonusDamage: 6, bonusMp: 0,
        tier: 2, cost: 350,
        passiveEffect: '10% chance to stun enemy for 1 turn.'
    },
    {
        id: 'holy_tome', name: 'Holy Tome', icon: '📕',
        description: 'A sacred book. +3 damage, +5 MP, Light bonus.',
        element: 'Light', bonusDamage: 3, bonusMp: 5,
        tier: 2, cost: 400,
        passiveEffect: 'Words heal 2 extra HP.'
    },
    // ══════════════════════════════
    // TIER 3 — Legendary
    // ══════════════════════════════
    {
        id: 'void_blade', name: 'Void Blade', icon: '⚫',
        description: 'A blade forged in the void. +10 damage, Dark bonus.',
        element: 'Dark', bonusDamage: 10, bonusMp: 0,
        tier: 3, cost: 800,
        passiveEffect: 'Dark words deal +30% damage. Drain 3 HP per hit.'
    },
    {
        id: 'staff_of_ages', name: 'Staff of Ages', icon: '🏛️',
        description: 'An ancient staff of immense power. +7 damage, +8 MP.',
        element: 'Arcane', bonusDamage: 7, bonusMp: 8,
        tier: 3, cost: 900,
        passiveEffect: 'All skill cooldowns reduced by 15%.'
    },
    {
        id: 'world_tree_bow', name: 'World Tree Bow', icon: '🌳',
        description: 'A bow carved from the World Tree. +8 damage, Nature bonus.',
        element: 'Nature', bonusDamage: 8, bonusMp: 3,
        tier: 3, cost: 850,
        passiveEffect: 'Heal 5 HP per word. Nature words deal +25% damage.'
    },
];
