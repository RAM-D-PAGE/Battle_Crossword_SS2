import { SkillData } from '../types';

export const SKILLS: SkillData[] = [
    // ═══════════════════════════════════════════
    // UNIVERSAL ACTIVE SKILLS
    // ═══════════════════════════════════════════
    {
        id: 'fireball', name: 'Fireball', icon: '🔥',
        description: 'Launch a fireball dealing fire damage.',
        element: 'Fire', manaCost: 15, cooldown: 5,
        effectType: 'Damage', value: 15,
        skillType: 'active', tier: 1, cost: 0
    },
    {
        id: 'inferno', name: 'Inferno', icon: '🌋',
        description: 'Unleash a massive inferno of flames. High damage, long cooldown.',
        element: 'Fire', manaCost: 40, cooldown: 15,
        effectType: 'Damage', value: 35,
        skillType: 'active', tier: 2, cost: 200
    },
    {
        id: 'ice_shard', name: 'Ice Shard', icon: '❄️',
        description: 'Hurl a shard of ice at the enemy.',
        element: 'Ice', manaCost: 10, cooldown: 3,
        effectType: 'Damage', value: 10,
        skillType: 'active', tier: 1, cost: 0
    },
    {
        id: 'blizzard', name: 'Blizzard', icon: '🌨️',
        description: 'Summon a devastating blizzard. Massive ice damage.',
        element: 'Ice', manaCost: 35, cooldown: 12,
        effectType: 'Damage', value: 35,
        skillType: 'active', tier: 2, cost: 200
    },
    {
        id: 'lightning_bolt', name: 'Lightning Bolt', icon: '⚡',
        description: 'Strike the enemy with lightning. Fast and reliable.',
        element: 'Thunder', manaCost: 20, cooldown: 8,
        effectType: 'Damage', value: 20,
        skillType: 'active', tier: 1, cost: 0
    },
    {
        id: 'thunder_storm', name: 'Thunder Storm', icon: '🌩️',
        description: 'Call down a storm of electric fury.',
        element: 'Thunder', manaCost: 30, cooldown: 10,
        effectType: 'Damage', value: 28,
        skillType: 'active', tier: 2, cost: 250
    },
    {
        id: 'shadow_bolt', name: 'Shadow Bolt', icon: '🌑',
        description: 'Fire a bolt of dark energy. Quick cast.',
        element: 'Dark', manaCost: 15, cooldown: 4,
        effectType: 'Damage', value: 18,
        skillType: 'active', tier: 1, cost: 0
    },
    {
        id: 'drain_life', name: 'Drain Life', icon: '🩸',
        description: 'Steal life force from the enemy. Deals damage and heals you.',
        element: 'Dark', manaCost: 25, cooldown: 8,
        effectType: 'Heal', value: 20,
        skillType: 'active', tier: 2, cost: 300
    },
    {
        id: 'heal', name: 'Heal', icon: '💚',
        description: 'Restore HP with holy light. Essential for survival.',
        element: 'Light', manaCost: 20, cooldown: 6,
        effectType: 'Heal', value: 25,
        skillType: 'active', tier: 1, cost: 0
    },
    {
        id: 'shield_of_faith', name: 'Shield of Faith', icon: '🛡️',
        description: 'Reduce damage from the next attack. Blocks a flat amount.',
        element: 'Light', manaCost: 30, cooldown: 15,
        effectType: 'Buff', value: 15,
        skillType: 'active', tier: 2, cost: 250
    },
    {
        id: 'natures_blessing', name: "Nature's Blessing", icon: '🌿',
        description: 'The forest heals your wounds. Gentle but reliable.',
        element: 'Nature', manaCost: 20, cooldown: 8,
        effectType: 'Heal', value: 20,
        skillType: 'active', tier: 1, cost: 0
    },
    {
        id: 'shuffle', name: 'Shuffle', icon: '🔄',
        description: 'Discard your hand and draw 7 new tiles. Fresh start!',
        element: 'Arcane', manaCost: 10, cooldown: 5,
        effectType: 'Utility', value: 0,
        skillType: 'active', tier: 1, cost: 0
    },

    // ═══════════════════════════════════════════
    // TIER 3 — ULTIMATE ACTIVE SKILLS
    // ═══════════════════════════════════════════
    {
        id: 'meteor', name: 'Meteor Strike', icon: '☄️',
        description: 'Call a meteor from the sky. Enormous damage but very expensive.',
        element: 'Fire', manaCost: 60, cooldown: 20,
        effectType: 'Damage', value: 60,
        skillType: 'active', tier: 3, cost: 500
    },
    {
        id: 'absolute_zero', name: 'Absolute Zero', icon: '🧊',
        description: 'Freeze all matter to absolute zero. Devastating ice attack.',
        element: 'Ice', manaCost: 55, cooldown: 18,
        effectType: 'Damage', value: 55,
        skillType: 'active', tier: 3, cost: 500
    },
    {
        id: 'divine_judgment', name: 'Divine Judgment', icon: '⚜️',
        description: 'Call upon divine power to smite evil. Deals damage and heals.',
        element: 'Light', manaCost: 50, cooldown: 20,
        effectType: 'Damage', value: 40,
        skillType: 'active', tier: 3, cost: 500
    },
    {
        id: 'void_rift', name: 'Void Rift', icon: '🕳️',
        description: 'Tear a rift in reality. Massive arcane damage.',
        element: 'Arcane', manaCost: 65, cooldown: 25,
        effectType: 'Damage', value: 70,
        skillType: 'active', tier: 3, cost: 600
    },

    // ═══════════════════════════════════════════
    // CLASS-SPECIFIC ACTIVE SKILLS
    // ═══════════════════════════════════════════
    {
        id: 'word_mastery', name: 'Word Mastery', icon: '📖',
        description: 'Scribe only. Draw 3 extra tiles and +30% word damage for 1 turn.',
        element: 'Arcane', manaCost: 25, cooldown: 12,
        effectType: 'Buff', value: 30,
        skillType: 'active', tier: 2, cost: 0,
        classRestriction: 'scribe'
    },
    {
        id: 'berserk', name: 'Berserk', icon: '💢',
        description: 'Barbarian only. Double damage for next word, but take 10% recoil.',
        element: 'Fire', manaCost: 20, cooldown: 10,
        effectType: 'Buff', value: 100,
        skillType: 'active', tier: 2, cost: 0,
        classRestriction: 'barbarian'
    },
    {
        id: 'backstab', name: 'Backstab', icon: '🗡️',
        description: 'Rogue only. Guaranteed critical hit on next word.',
        element: 'Dark', manaCost: 30, cooldown: 12,
        effectType: 'Buff', value: 0,
        skillType: 'active', tier: 2, cost: 0,
        classRestriction: 'rogue'
    },
    {
        id: 'divine_shield', name: 'Divine Shield', icon: '✨',
        description: 'Paladin only. Block all damage for 1 enemy turn.',
        element: 'Light', manaCost: 35, cooldown: 15,
        effectType: 'Buff', value: 999,
        skillType: 'active', tier: 2, cost: 0,
        classRestriction: 'paladin'
    },
    {
        id: 'mass_heal', name: 'Mass Heal', icon: '🌟',
        description: 'Cleric only. Restore 50 HP instantly.',
        element: 'Light', manaCost: 40, cooldown: 15,
        effectType: 'Heal', value: 50,
        skillType: 'active', tier: 2, cost: 0,
        classRestriction: 'cleric'
    },
    {
        id: 'soul_harvest', name: 'Soul Harvest', icon: '💀',
        description: 'Warlock only. Deal 25 damage, restore 25 MP.',
        element: 'Dark', manaCost: 10, cooldown: 10,
        effectType: 'Damage', value: 25,
        skillType: 'active', tier: 2, cost: 0,
        classRestriction: 'warlock'
    },
    {
        id: 'arrow_volley', name: 'Arrow Volley', icon: '🏹',
        description: 'Ranger only. Rain arrows for Nature damage.',
        element: 'Nature', manaCost: 20, cooldown: 8,
        effectType: 'Damage', value: 22,
        skillType: 'active', tier: 2, cost: 0,
        classRestriction: 'ranger'
    },
    {
        id: 'time_warp', name: 'Time Warp', icon: '⏳',
        description: 'Chronomancer only. Reset all skill cooldowns.',
        element: 'Arcane', manaCost: 50, cooldown: 30,
        effectType: 'Utility', value: 0,
        skillType: 'active', tier: 2, cost: 0,
        classRestriction: 'chronomancer'
    },
    {
        id: 'blood_pact', name: 'Blood Pact', icon: '🩸',
        description: 'Necromancer only. Sacrifice 20 HP to deal 40 damage.',
        element: 'Dark', manaCost: 5, cooldown: 8,
        effectType: 'Damage', value: 40,
        skillType: 'active', tier: 2, cost: 0,
        classRestriction: 'necromancer'
    },
    {
        id: 'earth_shatter', name: 'Earth Shatter', icon: '🌍',
        description: 'Monk only. Nature damage that scales with word length.',
        element: 'Nature', manaCost: 25, cooldown: 10,
        effectType: 'Damage', value: 30,
        skillType: 'active', tier: 2, cost: 0,
        classRestriction: 'monk'
    },

    // ═══════════════════════════════════════════
    // PASSIVE SKILLS
    // ═══════════════════════════════════════════
    {
        id: 'p_word_power', name: 'Word Power', icon: '📝',
        description: 'All word damage +10%.',
        element: 'Neutral', manaCost: 0, cooldown: 0,
        effectType: 'Buff', value: 10,
        skillType: 'passive', tier: 1, cost: 150,
        passiveEffect: 'wordDamage+10%'
    },
    {
        id: 'p_mana_flow', name: 'Mana Flow', icon: '💧',
        description: 'Gain +3 MP per word submitted.',
        element: 'Arcane', manaCost: 0, cooldown: 0,
        effectType: 'Buff', value: 3,
        skillType: 'passive', tier: 1, cost: 150,
        passiveEffect: 'mpPerWord+3'
    },
    {
        id: 'p_thick_skin', name: 'Thick Skin', icon: '🛡️',
        description: 'Reduce all incoming damage by 3.',
        element: 'Neutral', manaCost: 0, cooldown: 0,
        effectType: 'Buff', value: 3,
        skillType: 'passive', tier: 1, cost: 200,
        passiveEffect: 'damageReduction+3'
    },
    {
        id: 'p_lucky_draw', name: 'Lucky Draw', icon: '🍀',
        description: '+15% chance to draw rare letters (J,K,Q,X,Z).',
        element: 'Neutral', manaCost: 0, cooldown: 0,
        effectType: 'Buff', value: 15,
        skillType: 'passive', tier: 2, cost: 300,
        passiveEffect: 'rareChance+15%'
    },
    {
        id: 'p_crit_mastery', name: 'Crit Mastery', icon: '💥',
        description: '+10% critical hit rate for all words.',
        element: 'Neutral', manaCost: 0, cooldown: 0,
        effectType: 'Buff', value: 10,
        skillType: 'passive', tier: 2, cost: 300,
        passiveEffect: 'critRate+10%'
    },
    {
        id: 'p_gold_finder', name: 'Gold Finder', icon: '💰',
        description: 'Earn +25% gold from battles.',
        element: 'Neutral', manaCost: 0, cooldown: 0,
        effectType: 'Buff', value: 25,
        skillType: 'passive', tier: 1, cost: 100,
        passiveEffect: 'goldBonus+25%'
    },
    {
        id: 'p_hp_regen', name: 'Regeneration', icon: '❤️‍🩹',
        description: 'Heal 2 HP at the start of each turn.',
        element: 'Light', manaCost: 0, cooldown: 0,
        effectType: 'Buff', value: 2,
        skillType: 'passive', tier: 2, cost: 350,
        passiveEffect: 'hpRegen+2'
    },
];
