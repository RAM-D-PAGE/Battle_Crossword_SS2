import { TileData } from '../types';

// Scrabble-like distribution (simplified for 100 tiles)
const LETTER_DISTRIBUTION: Record<string, { weight: number; value: number }> = {
    A: { weight: 9, value: 1 },
    B: { weight: 2, value: 3 },
    C: { weight: 2, value: 3 },
    D: { weight: 4, value: 2 },
    E: { weight: 12, value: 1 },
    F: { weight: 2, value: 4 },
    G: { weight: 3, value: 2 },
    H: { weight: 2, value: 4 },
    I: { weight: 9, value: 1 },
    J: { weight: 1, value: 8 },
    K: { weight: 1, value: 5 },
    L: { weight: 4, value: 1 },
    M: { weight: 2, value: 3 },
    N: { weight: 6, value: 1 },
    O: { weight: 8, value: 1 },
    P: { weight: 2, value: 3 },
    Q: { weight: 1, value: 10 },
    R: { weight: 6, value: 1 },
    S: { weight: 4, value: 1 },
    T: { weight: 6, value: 1 },
    U: { weight: 4, value: 1 },
    V: { weight: 2, value: 4 },
    W: { weight: 2, value: 4 },
    X: { weight: 1, value: 8 },
    Y: { weight: 2, value: 4 },
    Z: { weight: 1, value: 10 }
};

const VOWELS = ['A', 'E', 'I', 'O', 'U'];


// Create a pool of letters based on weights
const LETTER_POOL: string[] = [];
Object.entries(LETTER_DISTRIBUTION).forEach(([letter, data]) => {
    for (let i = 0; i < data.weight; i++) {
        LETTER_POOL.push(letter);
    }
});

/**
 * Roll for tile rarity.
 * 80% common, 15% rare (+2 value), 5% epic (+5 value)
 */
function rollRarity(): { rarity: TileData['rarity']; bonusValue: number } {
    const roll = Math.random();
    if (roll < 0.05) return { rarity: 'epic', bonusValue: 5 };
    if (roll < 0.20) return { rarity: 'rare', bonusValue: 2 };
    return { rarity: 'common', bonusValue: 0 };
}

/**
 * Roll for bonus tile type.
 * 8% chance: 2L(4%), 3L(2%), 2W(1.5%), 3W(0.5%)
 */
function rollBonus(): TileData['bonus'] | undefined {
    const roll = Math.random();
    if (roll < 0.005) return '3W';   // 0.5% — very rare
    if (roll < 0.020) return '2W';   // 1.5%
    if (roll < 0.040) return '3L';   // 2%
    if (roll < 0.080) return '2L';   // 4%
    return undefined;
}

/**
 * Roll for wildcard tile.
 * 2% chance per tile generation.
 */
function rollWild(): boolean {
    return Math.random() < 0.02;
}

export const TileSystem = {
    // Generate a single random tile with rarity, bonus, and wild chance
    generateTile: (): TileData => {
        // Wildcard check
        if (rollWild()) {
            return {
                id: Math.random().toString(36).substr(2, 9),
                letter: '★',
                value: 0,
                isWild: true,
                rarity: 'epic'
            };
        }

        const letter = LETTER_POOL[Math.floor(Math.random() * LETTER_POOL.length)];
        const { rarity, bonusValue } = rollRarity();
        const bonus = rollBonus();

        return {
            id: Math.random().toString(36).substr(2, 9),
            letter,
            value: LETTER_DISTRIBUTION[letter].value + bonusValue,
            rarity,
            bonus
        };
    },

    // Generate specific letter tile
    generateSpecificTile: (letter: string): TileData => {
        return {
            id: Math.random().toString(36).substr(2, 9),
            letter,
            value: LETTER_DISTRIBUTION[letter]?.value || 1,
            rarity: 'common'
        };
    },

    // Refill hand ensuring minimum vowels
    fillHand: (currentHand: TileData[], targetSize: number = 7, minVowels: number = 2): TileData[] => {
        const needed = targetSize - currentHand.length;
        if (needed <= 0) return currentHand;

        const newTiles: TileData[] = [];
        let currentVowelCount = currentHand.filter(t => VOWELS.includes(t.letter)).length;

        for (let i = 0; i < needed; i++) {
            const remainingSlots = needed - i;
            const vowelsNeeded = Math.max(0, minVowels - currentVowelCount);

            let tile: TileData;

            if (vowelsNeeded >= remainingSlots) {
                // Must generate a vowel
                const vowel = VOWELS[Math.floor(Math.random() * VOWELS.length)];
                tile = TileSystem.generateSpecificTile(vowel);
                currentVowelCount++;
            } else {
                tile = TileSystem.generateTile();
                if (VOWELS.includes(tile.letter)) {
                    currentVowelCount++;
                }
            }
            newTiles.push(tile);
        }

        return [...currentHand, ...newTiles];
    },

    // Get bonus label for display
    getBonusLabel: (bonus?: TileData['bonus']): string => {
        switch (bonus) {
            case '2L': return '2×L';
            case '3L': return '3×L';
            case '2W': return '2×W';
            case '3W': return '3×W';
            default: return '';
        }
    },

    // Get rarity color for display
    getRarityColor: (rarity?: TileData['rarity']): string => {
        switch (rarity) {
            case 'epic': return 'from-purple-500 to-pink-500';
            case 'rare': return 'from-blue-500 to-cyan-500';
            default: return 'from-zinc-700 to-zinc-600';
        }
    }
};
