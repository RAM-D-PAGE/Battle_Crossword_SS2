import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { CLASSES } from '../../core/data/Classes';
import { Swords, Scroll, Zap, Heart } from 'lucide-react';

export const MainMenu: React.FC = () => {
    const { initializeGame, startBattle } = useGameStore();
    const [selectedClassId, setSelectedClassId] = useState<string>('scribe');

    const handleStart = () => {
        initializeGame(selectedClassId);
        startBattle('slime_king');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[100svh] w-full bg-zinc-950 text-white p-6 gap-8 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950 -z-10" />

            {/* Title */}
            <div className="text-center space-y-2">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-600 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                    BATTLE<br />CROSSWORD
                </h1>
                <p className="text-zinc-400 font-mono tracking-widest text-sm">THE SPELLBOUND SAGA</p>
            </div>

            {/* Class Selection */}
            <div className="w-full max-w-md grid grid-cols-2 gap-4">
                {CLASSES.map((cls) => (
                    <button
                        key={cls.id}
                        onClick={() => setSelectedClassId(cls.id)}
                        className={`
                            relative flex flex-col gap-2 p-4 rounded-xl border-2 text-left transition-all duration-200
                            ${selectedClassId === cls.id
                                ? 'bg-indigo-900/40 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] scale-[1.02]'
                                : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800/60 hover:border-zinc-700 opacity-70 hover:opacity-100'}
                        `}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-lg">{cls.name}</span>
                            {/* Icons based on class? For now just generic */}
                            {cls.id === 'barbarian' && <Swords size={18} className="text-red-400" />}
                            {cls.id === 'scribe' && <Scroll size={18} className="text-blue-400" />}
                            {cls.id === 'rogue' && <Zap size={18} className="text-yellow-400" />}
                            {cls.id === 'cleric' && <Heart size={18} className="text-green-400" />}
                        </div>
                        <div className="text-xs text-zinc-400 leading-relaxed min-h-[40px]">
                            {cls.description}
                        </div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-300 mt-1">
                            Passive: {cls.passiveDescription}
                        </div>
                    </button>
                ))}
            </div>

            {/* Start Button */}
            <button
                onClick={handleStart}
                className="group relative px-12 py-5 bg-white text-black font-black text-xl uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.3)] mt-4"
            >
                <span className="relative z-10">Start Adventure</span>
                <div className="absolute inset-0 rounded-full bg-indigo-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
            </button>
        </div>
    );
};
