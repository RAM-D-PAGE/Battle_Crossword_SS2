import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';

/**
 * Keyboard controls for the battle screen:
 * 
 * A-Z        → Place matching tile from hand to next empty grid slot
 * Backspace  → Remove last tile from grid back to hand
 * Enter      → Submit word (Cast Spell)
 * 1-6        → Cast equipped skill (by slot number)
 * Escape     → Toggle help / close modals
 */
export function useKeyboard(
    submitWord: () => void,
    showHelp: boolean,
    setShowHelp: (v: boolean) => void
) {
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const state = useGameStore.getState();

        // Don't handle keys when game is not in battle
        if (state.gameStatus !== 'battle') return;

        // Don't handle if typing in an input field
        const tag = (e.target as HTMLElement).tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;

        const key = e.key;

        // ── Escape: Toggle Help ──
        if (key === 'Escape') {
            e.preventDefault();
            setShowHelp(!showHelp);
            return;
        }

        // ── Close help if open (don't process other keys) ──
        if (showHelp) return;

        // ── Enter: Submit Word ──
        if (key === 'Enter') {
            e.preventDefault();
            if (state.isPlayerTurn) {
                submitWord();
            }
            return;
        }

        // ── Backspace: Remove last tile from grid ──
        if (key === 'Backspace') {
            e.preventDefault();
            // Find the last filled slot
            const grid = state.grid;
            for (let i = grid.length - 1; i >= 0; i--) {
                if (grid[i] !== null) {
                    state.returnTileToHand(grid[i]!.id);
                    break;
                }
            }
            return;
        }

        // ── Number Keys (1-6): Cast Skill ──
        if (key >= '1' && key <= '6') {
            const slotIndex = parseInt(key) - 1;
            const skillId = state.equippedSkills[slotIndex];
            if (skillId && state.isPlayerTurn) {
                state.castSkill(skillId);
            }
            return;
        }

        // ── Letter Keys (A-Z): Place tile ──
        const letter = key.toUpperCase();
        if (letter.length === 1 && letter >= 'A' && letter <= 'Z') {
            e.preventDefault();
            if (!state.isPlayerTurn) return;

            // Find a matching tile in hand
            const tileIndex = state.hand.findIndex(t => t.letter === letter);
            if (tileIndex === -1) return; // No tile with this letter

            // Find the first empty grid slot
            const emptySlot = state.grid.findIndex(slot => slot === null);
            if (emptySlot === -1) return; // Grid is full

            // Place the tile
            state.placeTile(state.hand[tileIndex].id, emptySlot);
        }
    }, [submitWord, showHelp, setShowHelp]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
