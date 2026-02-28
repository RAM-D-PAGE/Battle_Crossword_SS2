// ═══════════════════════════════════════
// Hint System — Find valid words from hand
// ═══════════════════════════════════════

import { TileData } from '../types';
import { WORD_SET } from '../data/Dictionary';
import { calculateWordScore } from './DamageSystem';

interface HintResult {
    word: string;
    score: number;
    tiles: TileData[];
}

/**
 * Find valid words that can be formed from the given hand tiles.
 * Returns up to `maxResults` suggestions sorted by score (highest first).
 */
export function findHints(hand: TileData[], maxResults: number = 3): HintResult[] {
    const results: HintResult[] = [];
    const letters = hand.map(t => t.letter);

    // Generate all permutations of length 2-7 from available letters
    const checked = new Set<string>();

    function permute(current: number[], remaining: number[]) {
        if (current.length >= 2) {
            const word = current.map(i => letters[i]).join('').toLowerCase();

            if (!checked.has(word)) {
                checked.add(word);
                if (WORD_SET.has(word)) {
                    const tiles = current.map(i => hand[i]);
                    results.push({
                        word: word.toUpperCase(),
                        score: calculateWordScore(tiles),
                        tiles
                    });
                }
            }
        }

        if (current.length >= 7) return;

        for (let i = 0; i < remaining.length; i++) {
            const next = remaining[i];
            const newRemaining = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
            permute([...current, next], newRemaining);

            // Early exit if we have enough results with good scores
            if (results.length >= maxResults * 3) return;
        }
    }

    const indices = hand.map((_, i) => i);
    permute([], indices);

    // Sort by score descending and return top results
    results.sort((a, b) => b.score - a.score);

    // Deduplicate by word
    const seen = new Set<string>();
    const unique: HintResult[] = [];
    for (const r of results) {
        if (!seen.has(r.word)) {
            seen.add(r.word);
            unique.push(r);
            if (unique.length >= maxResults) break;
        }
    }

    return unique;
}
