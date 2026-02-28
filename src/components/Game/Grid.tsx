import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Tile } from './Tile';

interface GridSlotProps {
    id: string;
    index: number;
    letter?: string;
    children?: React.ReactNode;
}

const GridSlot: React.FC<GridSlotProps> = ({ id, index, letter, children }) => {
    const { isOver, setNodeRef } = useDroppable({ id });
    const { tapToPlace } = useSettingsStore();
    const { grid, hand, placeTile } = useGameStore();

    // Tap-to-place: click empty slot to place selected (first) tile from hand
    const handleSlotClick = () => {
        if (!tapToPlace) return;
        if (grid[index] !== null) return; // Slot already filled
        if (hand.length === 0) return;

        // Find the selected tile (the first one in hand, or use global selected)
        const selectedTileId = useGameStore.getState()._selectedTileId;
        if (selectedTileId) {
            placeTile(selectedTileId, index);
            useGameStore.setState({ _selectedTileId: null });
        }
    };

    return (
        <motion.div
            ref={setNodeRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={handleSlotClick}
            className={`
                w-[var(--slot-size)] h-[var(--slot-size)] md:w-[var(--slot-size-md)] md:h-[var(--slot-size-md)]
                rounded-xl flex items-center justify-center relative transition-all duration-200
                ${tapToPlace ? 'cursor-pointer' : ''}
                ${isOver
                    ? 'grid-slot-hover'
                    : letter
                        ? 'grid-slot-filled'
                        : 'grid-slot'}
            `}
        >
            {/* Slot number indicator */}
            {!children && (
                <span className="text-white/[0.06] text-2xl font-black select-none">{index + 1}</span>
            )}
            {children}
        </motion.div>
    );
};

export const Grid: React.FC = () => {
    const grid = useGameStore((state) => state.grid);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-1.5 md:gap-2 p-4 md:p-5 glass-card rounded-2xl"
        >
            {grid.map((tileData, index) => (
                <GridSlot
                    key={`slot-${index}`}
                    id={`slot-${index}`}
                    index={index}
                    letter={tileData?.letter}
                >
                    {tileData && (
                        <Tile
                            id={tileData.id}
                            letter={tileData.letter}
                            value={tileData.value}
                            isOnGrid={true}
                            bonus={tileData.bonus}
                            isWild={tileData.isWild}
                            rarity={tileData.rarity}
                        />
                    )}
                </GridSlot>
            ))}
        </motion.div>
    );
};
