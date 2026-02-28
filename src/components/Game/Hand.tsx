import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Tile } from './Tile';

export const Hand: React.FC = () => {
    const hand = useGameStore((state) => state.hand);
    const discardsRemaining = useGameStore((state) => state.discardsRemaining);
    const discardTile = useGameStore((state) => state.discardTile);
    const { autoSort } = useSettingsStore();

    // Auto-sort if enabled
    const displayHand = autoSort
        ? [...hand].sort((a, b) => a.letter.localeCompare(b.letter))
        : hand;

    const handleDiscard = (tileId: string) => {
        if (discardsRemaining > 0) {
            discardTile(tileId);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-1.5 md:gap-2 p-3 md:p-4 glass-card rounded-2xl min-h-[4.5rem] items-center justify-center flex-wrap"
            >
                {displayHand.length === 0 ? (
                    <span className="text-zinc-600 text-sm font-mono">No tiles...</span>
                ) : (
                    displayHand.map((tile) => (
                        <div key={tile.id} className="relative group">
                            <Tile
                                id={tile.id}
                                letter={tile.letter}
                                value={tile.value}
                                bonus={tile.bonus}
                                isWild={tile.isWild}
                                rarity={tile.rarity}
                            />
                            {/* Discard button - appears on hover */}
                            {discardsRemaining > 0 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDiscard(tile.id); }}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-400 text-white text-[9px] font-bold rounded-full
                                             opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20
                                             flex items-center justify-center"
                                    title="Discard tile"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))
                )}
            </motion.div>

            {/* Discard indicator */}
            <div className="flex justify-center">
                <span className={`text-[10px] px-3 py-1 rounded-full ${discardsRemaining > 0
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-zinc-800/50 text-zinc-600'
                    }`}>
                    🔄 {discardsRemaining > 0 ? `${discardsRemaining} discard left` : 'No discards'}
                </span>
            </div>
        </div>
    );
};
