import { TileData, ElementType, ClassData } from '../types';

// ═══════════════════════════════════════════════════
// Element Advantage Chart
// ═══════════════════════════════════════════════════
export const ELEMENT_MULTIPLIERS: Record<ElementType, Record<ElementType, number>> = {
    Neutral: { Neutral: 1, Fire: 1, Ice: 1, Thunder: 1, Nature: 1, Arcane: 1, Light: 1, Dark: 1 },
    Fire: { Neutral: 1, Fire: 0.5, Ice: 0.5, Thunder: 1, Nature: 2, Arcane: 1, Light: 1, Dark: 1 },
    Ice: { Neutral: 1, Fire: 2, Ice: 0.5, Thunder: 0.5, Nature: 1, Arcane: 1, Light: 1, Dark: 1 },
    Thunder: { Neutral: 1, Fire: 1, Ice: 2, Thunder: 0.5, Nature: 0.5, Arcane: 1, Light: 1, Dark: 1 },
    Nature: { Neutral: 1, Fire: 0.5, Ice: 1, Thunder: 2, Nature: 0.5, Arcane: 1, Light: 1, Dark: 1 },
    Arcane: { Neutral: 1, Fire: 1, Ice: 1, Thunder: 1, Nature: 1, Arcane: 0.5, Light: 2, Dark: 0.5 },
    Light: { Neutral: 1, Fire: 1, Ice: 1, Thunder: 1, Nature: 1, Arcane: 0.5, Light: 0.5, Dark: 2 },
    Dark: { Neutral: 1, Fire: 1, Ice: 1, Thunder: 1, Nature: 1, Arcane: 2, Light: 0.5, Dark: 0.5 }
};

/**
 * Calculate raw word score from tile values with bonus multipliers.
 */
export function calculateWordScore(tiles: TileData[]): number {
    let letterSum = 0;
    let wordMultiplier = 1;

    for (const tile of tiles) {
        let tileValue = tile.value;

        // Letter multipliers
        if (tile.bonus === '2L') tileValue *= 2;
        if (tile.bonus === '3L') tileValue *= 3;

        // Word multipliers (accumulate)
        if (tile.bonus === '2W') wordMultiplier *= 2;
        if (tile.bonus === '3W') wordMultiplier *= 3;

        letterSum += tileValue;
    }

    return (letterSum * tiles.length) * wordMultiplier;
}

/**
 * Master damage calculation with full class passives, combo, and bonus tiles.
 */
export function calculateDamage(
    wordTiles: TileData[],
    wordElement: ElementType = 'Neutral',
    targetElement: ElementType = 'Neutral',
    playerClass?: ClassData,
    weaponBonusDamage: number = 0,
    comboCount: number = 0
): { totalDamage: number; isCrit: boolean; isEffective: boolean; mpGain: number; healAmount: number; comboMultiplier: number } {

    const baseScore = calculateWordScore(wordTiles);
    let mpGain = 0;
    let healAmount = 0;

    // ── Element Modifier ──
    const elementMod = ELEMENT_MULTIPLIERS[wordElement]?.[targetElement] || 1;

    // ── Length Modifier ──
    let lengthMod = 1.0;
    if (wordTiles.length >= 7) lengthMod = 2.0;
    else if (wordTiles.length >= 6) lengthMod = 1.8;
    else if (wordTiles.length >= 5) lengthMod = 1.5;

    // ── Combo Modifier ──
    // Each consecutive valid word increases damage: 0→1x, 1→1.2x, 2→1.4x, 3→1.6x, 4→1.8x, 5+→2x
    const comboMultiplier = Math.min(2.0, 1.0 + comboCount * 0.2);

    // ── Element Synergy ──
    // If all tiles have the same element, bonus 1.5x
    let synergyMod = 1.0;
    const tileElements = wordTiles.filter(t => t.element).map(t => t.element);
    if (tileElements.length >= 3) {
        const allSame = tileElements.every(e => e === tileElements[0]);
        if (allSame) synergyMod = 1.5;
    }

    // ── Class Passives ──
    let classMod = 1.0;
    let critBonus = 0;

    if (playerClass) {
        switch (playerClass.id) {
            case 'barbarian':
                if (wordTiles.length >= 3 && wordTiles.length <= 4) classMod = 1.5;
                break;
            case 'scribe':
                if (wordTiles.length >= 5) { classMod = 1.3; mpGain += 15; }
                break;
            case 'rogue':
                critBonus = 0.20;
                const rareLetters = ['J', 'K', 'Q', 'X', 'Z'];
                if (wordTiles.some(t => rareLetters.includes(t.letter))) classMod = 2.0;
                break;
            case 'cleric':
                healAmount += 6;
                break;
            case 'paladin':
                healAmount += 5;
                if (wordElement === 'Light') classMod = 1.5;
                break;
            case 'warlock':
                if (wordElement === 'Dark') classMod = 1.5;
                mpGain += Math.floor(baseScore * 0.1);
                break;
            case 'ranger': {
                const vowels = ['A', 'E', 'I', 'O', 'U'];
                const vowelCount = wordTiles.filter(t => vowels.includes(t.letter)).length;
                if (vowelCount > 0) healAmount += vowelCount;
                classMod = 1.0 + (vowelCount * 0.08);
                break;
            }
            case 'chronomancer':
                mpGain += 3;
                if (wordTiles.length >= 5) { classMod = 1.2; mpGain += 5; }
                break;
            case 'necromancer': {
                const uniqueLetters = new Set(wordTiles.map(t => t.letter)).size;
                if (uniqueLetters >= 4) classMod = 1.15;
                if (wordElement === 'Dark') classMod *= 1.3;
                break;
            }
            case 'monk': {
                const letters = wordTiles.map(t => t.letter);
                const allUnique = new Set(letters).size === letters.length;
                if (allUnique && wordTiles.length >= 3) classMod = 1.2;
                healAmount += 3;
                break;
            }
        }
    }

    // ── Weapon Bonus ──
    const weaponDmg = weaponBonusDamage || 0;

    // ── Base MP Gain ──
    mpGain += Math.max(3, Math.floor(wordTiles.length * 1.5));

    // ── Critical Hit ──
    const baseCritRate = 0.05 + critBonus;
    const isCrit = Math.random() < baseCritRate;
    const critMod = isCrit ? 2.0 : 1.0;

    // ── Final Calculation ──
    const totalDamage = Math.floor(
        (baseScore + weaponDmg) * elementMod * lengthMod * classMod * critMod * comboMultiplier * synergyMod
    );

    return {
        totalDamage,
        isCrit,
        isEffective: elementMod > 1,
        mpGain,
        healAmount,
        comboMultiplier
    };
}
