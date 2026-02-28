import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { useSettingsStore } from '../../store/useSettingsStore';

interface TileProps {
    id: string;
    letter: string;
    value: number;
    isOnGrid?: boolean;
    bonus?: '2L' | '3L' | '2W' | '3W';
    isWild?: boolean;
    rarity?: 'common' | 'rare' | 'epic';
}

const RARE_LETTERS = ['J', 'K', 'Q', 'X', 'Z'];
const HIGH_LETTERS = ['F', 'H', 'V', 'W', 'Y'];

export const Tile: React.FC<TileProps> = ({ id, letter, value, isOnGrid = false, bonus, isWild, rarity }) => {
    const { tapToPlace } = useSettingsStore();
    const selectedTileId = useGameStore((s) => (s as any)._selectedTileId);

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: { letter, value, id },
        disabled: tapToPlace, // Disable dragging in tap-to-place mode
    });

    const isRare = RARE_LETTERS.includes(letter);
    const isHigh = HIGH_LETTERS.includes(letter);
    const isSelected = selectedTileId === id;

    const tileColor = isWild
        ? 'from-yellow-300 via-amber-400 to-orange-500 border-yellow-400/60'
        : rarity === 'epic'
            ? 'from-purple-300 via-fuchsia-300 to-purple-400 border-purple-400/60'
            : rarity === 'rare'
                ? 'from-sky-200 via-blue-300 to-sky-400 border-blue-400/60'
                : isRare
                    ? 'from-amber-200 via-yellow-300 to-amber-400 border-amber-400/60'
                    : isHigh
                        ? 'from-emerald-200 via-emerald-300 to-emerald-400 border-emerald-400/60'
                        : 'from-indigo-100 via-violet-200 to-indigo-300 border-violet-300/60';

    const textColor = isWild ? 'text-orange-900' : isRare ? 'text-amber-900' : isHigh ? 'text-emerald-900' : 'text-indigo-900';
    const valueBg = isWild ? 'bg-orange-600' : isRare ? 'bg-amber-600' : isHigh ? 'bg-emerald-600' : 'bg-indigo-600';

    // Tap-to-place: click tile in hand to select, click tile on grid to return
    const handleTapClick = () => {
        if (!tapToPlace) return;

        if (isOnGrid) {
            // Return tile to hand
            useGameStore.getState().returnTileToHand(id);
        } else {
            // Select this tile for placement
            useGameStore.setState({ _selectedTileId: isSelected ? null : id });
        }
    };

    return (
        <motion.div
            ref={setNodeRef}
            {...(tapToPlace ? {} : listeners)}
            {...(tapToPlace ? {} : attributes)}
            layoutId={id}
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{
                scale: isDragging ? 1.15 : 1,
                opacity: 1,
                y: 0,
                rotate: isDragging ? Math.random() * 6 - 3 : 0,
                zIndex: isDragging ? 50 : 1
            }}
            whileHover={{ scale: 1.08, y: -6 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
                transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
            }}
            onClick={handleTapClick}
            className={`
                w-[var(--tile-size)] h-[var(--tile-size)] md:w-[var(--tile-size-md)] md:h-[var(--tile-size-md)]
                bg-gradient-to-br ${tileColor} rounded-xl
                flex items-center justify-center select-none relative
                ${tapToPlace ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'}
                ${isDragging
                    ? 'shadow-[0_8px_30px_rgba(99,102,241,0.4)] ring-2 ring-white/50'
                    : 'shadow-[0_4px_0_rgba(0,0,0,0.15),0_6px_12px_rgba(0,0,0,0.2)]'}
                ${isSelected && tapToPlace ? 'ring-4 ring-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)]' : ''}
            `}
        >
            <span className={`text-2xl md:text-3xl font-black ${textColor} drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]`}>
                {letter}
            </span>
            <span className={`absolute bottom-0.5 right-1.5 text-[9px] font-bold text-white ${valueBg} w-4 h-4 rounded-full flex items-center justify-center`}>
                {value}
            </span>
            {isRare && (
                <span className="absolute -top-1 -right-1 text-[8px]">✨</span>
            )}
            {isWild && (
                <span className="absolute -top-1 -left-1 text-[9px] animate-pulse">⭐</span>
            )}
            {bonus && (
                <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[7px] font-black px-1.5 py-0.5 rounded-full shadow-md ${bonus.includes('W')
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    }`}>
                    {bonus === '2L' ? '2×L' : bonus === '3L' ? '3×L' : bonus === '2W' ? '2×W' : '3×W'}
                </span>
            )}
            {(rarity === 'rare' || rarity === 'epic') && (
                <div className={`absolute inset-0 rounded-xl pointer-events-none ${rarity === 'epic'
                        ? 'shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                        : 'shadow-[0_0_8px_rgba(56,189,248,0.4)]'
                    }`} />
            )}
        </motion.div>
    );
};
