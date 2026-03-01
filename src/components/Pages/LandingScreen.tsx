import React from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useGameStore } from '../../store/useGameStore';
import { Gamepad2, Brain } from 'lucide-react';

interface LandingScreenProps {
    onNavigate: (page: string) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate }) => {
    const { enableElderlyMode, disableElderlyMode } = useSettingsStore();
    const { startZenMode } = useGameStore();

    const handleElderlyChoice = () => {
        enableElderlyMode();
        startZenMode();
        onNavigate('battle');
    };

    const handleFullGameChoice = () => {
        disableElderlyMode();
        onNavigate('mainMenu');
    };

    return (
        <div className="min-h-[100dvh] w-full bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background elements */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-[100px]" />
            </div>

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-12 text-center"
            >
                เลือกรูปแบบการเล่น
            </motion.h1>

            <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl z-10">

                {/* Elderly Mode Option (Word Practice) */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleElderlyChoice}
                    className="flex-1 min-h-[280px] bg-zinc-900/80 border-2 border-emerald-500/30 rounded-3xl p-8 flex flex-col items-center justify-center gap-6 hover:bg-zinc-800 transition-colors shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <Brain size={48} className="text-emerald-400" />
                    </div>

                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-emerald-400 mb-3">ฝึกสมอง</h2>
                        <p className="text-xl text-zinc-300">โหมดผู้สูงอายุ</p>
                        <p className="text-sm text-emerald-500/80 mt-2">เล่นง่ายต่อคำศัพท์ ไม่จำกัดเวลา</p>
                    </div>
                </motion.button>

                {/* Full Game Option */}
                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFullGameChoice}
                    className="flex-1 min-h-[280px] bg-zinc-900/80 border-2 border-indigo-500/30 rounded-3xl p-8 flex flex-col items-center justify-center gap-6 hover:bg-zinc-800 transition-colors shadow-[0_0_30px_rgba(99,102,241,0.1)] relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center">
                        <Gamepad2 size={48} className="text-indigo-400" />
                    </div>

                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-indigo-400 mb-3">เกม Battle CrossWord</h2>
                        <p className="text-xl text-zinc-300">เกมเต็มรูปแบบ</p>
                        <p className="text-sm text-indigo-500/80 mt-2">เวทย์มนต์ ทักษะ เล่นออนไลน์</p>
                    </div>
                </motion.button>

            </div>
        </div>
    );
};
