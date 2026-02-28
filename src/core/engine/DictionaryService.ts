import { WORD_SET } from '../data/Dictionary';

// ═══════════════════════════════════════════════════
// Hybrid Dictionary Service
// 1. Check local WORD_SET (instant)
// 2. If not found → check API (async)
// 3. Cache API results in memory + localStorage
// ═══════════════════════════════════════════════════

const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const CACHE_KEY = 'bcw-dict-cache';
const CACHE_NEG_KEY = 'bcw-dict-neg-cache'; // words confirmed NOT valid

// In-memory cache for the session
const memoryCache = new Map<string, boolean>();

// Load localStorage cache
function loadCache(): Record<string, boolean> {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function loadNegCache(): Record<string, boolean> {
    try {
        const raw = localStorage.getItem(CACHE_NEG_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveToCache(word: string, valid: boolean): void {
    try {
        if (valid) {
            const cache = loadCache();
            cache[word] = true;
            // Limit cache size to 5000 entries
            const keys = Object.keys(cache);
            if (keys.length > 5000) {
                delete cache[keys[0]];
            }
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } else {
            const cache = loadNegCache();
            cache[word] = true;
            const keys = Object.keys(cache);
            if (keys.length > 3000) {
                delete cache[keys[0]];
            }
            localStorage.setItem(CACHE_NEG_KEY, JSON.stringify(cache));
        }
    } catch {
        // localStorage full — ignore
    }
}

/**
 * Check if a word is valid using hybrid local + API approach.
 * Returns immediately if found in local dictionary or cache.
 * Falls back to API for unknown words.
 */
export async function isValidWord(word: string): Promise<boolean> {
    const lower = word.toLowerCase();

    // 1) Too short — always invalid
    if (lower.length < 2) return false;

    // 2) Check local dictionary (instant)
    if (WORD_SET.has(lower)) return true;

    // 3) Check in-memory cache
    if (memoryCache.has(lower)) return memoryCache.get(lower)!;

    // 4) Check localStorage cache
    const posCache = loadCache();
    if (posCache[lower]) {
        memoryCache.set(lower, true);
        return true;
    }
    const negCache = loadNegCache();
    if (negCache[lower]) {
        memoryCache.set(lower, false);
        return false;
    }

    // 5) API fallback
    try {
        const response = await fetch(`${API_URL}${encodeURIComponent(lower)}`, {
            signal: AbortSignal.timeout(3000) // 3 second timeout
        });

        if (response.ok) {
            // Word exists in API
            memoryCache.set(lower, true);
            saveToCache(lower, true);
            return true;
        } else if (response.status === 404) {
            // Word does NOT exist
            memoryCache.set(lower, false);
            saveToCache(lower, false);
            return false;
        }

        // Other error — fallback to false
        return false;
    } catch {
        // Network error / timeout — fallback to local-only result (false)
        return false;
    }
}

/**
 * Synchronous check — only local dictionary + cache, no API.
 * Use for damage preview (non-blocking).
 */
export function isValidWordSync(word: string): boolean {
    const lower = word.toLowerCase();
    if (lower.length < 2) return false;
    if (WORD_SET.has(lower)) return true;
    if (memoryCache.has(lower)) return memoryCache.get(lower)!;

    const posCache = loadCache();
    if (posCache[lower]) {
        memoryCache.set(lower, true);
        return true;
    }
    return false;
}

/**
 * Get cache stats for debugging.
 */
export function getCacheStats(): { local: number; cached: number; negCached: number } {
    return {
        local: WORD_SET.size,
        cached: Object.keys(loadCache()).length,
        negCached: Object.keys(loadNegCache()).length
    };
}
