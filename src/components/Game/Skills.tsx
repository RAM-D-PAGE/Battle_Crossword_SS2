import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { SKILLS } from '../../core/data/Skills';
import { Zap } from 'lucide-react';

// Element to color mapping
const ELEMENT_COLORS: Record<string, string> = {
    Fire: 'border-orange-500/40 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]',
    Ice: 'border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]',
    Thunder: 'border-yellow-500/40 hover:border-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]',
    Dark: 'border-purple-500/40 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    Light: 'border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]',
    Nature: 'border-green-500/40 hover:border-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]',
    Arcane: 'border-pink-500/40 hover:border-pink-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]',
    Neutral: 'border-zinc-500/40 hover:border-zinc-400'
};

export const Skills: React.FC = () => {
    const { equippedSkills, playerMp, skillCooldowns, castSkill, isPlayerTurn } = useGameStore();
    const [now, setNow] = useState(Date.now());
    const [tooltip, setTooltip] = useState<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex gap-2 md:gap-3 justify-center items-end py-1 flex-wrap relative">
            {equippedSkills.map((skillId, i) => {
                const skill = SKILLS.find(s => s.id === skillId);
                if (!skill) return null;
                // Only show active skills in battle bar
                if (skill.skillType === 'passive') return null;

                const lastUsed = skillCooldowns[skillId] || 0;
                const cooldownMs = skill.cooldown * 1000;
                const remaining = Math.max(0, (lastUsed + cooldownMs) - now);
                const isCooldown = remaining > 0;
                const progress = isCooldown ? (remaining / cooldownMs) * 100 : 0;
                const canCast = isPlayerTurn && !isCooldown && playerMp >= skill.manaCost;
                const elementColor = ELEMENT_COLORS[skill.element] || ELEMENT_COLORS.Neutral;

                return (
                    <motion.button
                        key={skillId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={canCast ? { scale: 1.08, y: -5 } : {}}
                        whileTap={canCast ? { scale: 0.92 } : {}}
                        onClick={() => canCast && castSkill(skillId)}
                        onMouseEnter={() => setTooltip(skillId)}
                        onMouseLeave={() => setTooltip(null)}
                        disabled={!canCast}
                        className={`
                            relative w-[4.5rem] h-[4.5rem] md:w-20 md:h-20 rounded-2xl border-2 flex flex-col items-center justify-center
                            overflow-hidden transition-all duration-200 skill-btn
                            ${canCast ? `cursor-pointer ${elementColor}` : 'opacity-40 cursor-not-allowed border-zinc-800 grayscale'}
                        `}
                    >
                        {/* Cooldown Overlay */}
                        {isCooldown && (
                            <div className="absolute inset-0 bg-black/70 z-20 flex items-center justify-center">
                                <span className="text-sm font-bold font-mono text-white">{Math.ceil(remaining / 1000)}s</span>
                            </div>
                        )}

                        {/* Cooldown Progress (bottom-up fill) */}
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-white/5 z-10 transition-all duration-100"
                            style={{ height: `${progress}%` }}
                        />

                        {/* Skill Icon */}
                        <span className="text-2xl md:text-3xl z-30">{skill.icon}</span>

                        {/* Skill Name */}
                        <span className="text-[8px] md:text-[9px] font-bold text-zinc-300 z-30 truncate max-w-full px-1 mt-0.5 leading-tight">
                            {skill.name}
                        </span>

                        {/* Mana Cost Badge */}
                        <div className="absolute top-1 right-1 text-[9px] bg-indigo-600/80 px-1.5 py-0.5 rounded-lg text-indigo-100 font-mono flex items-center gap-0.5 z-30">
                            <Zap size={8} className="fill-indigo-200" />
                            {skill.manaCost}
                        </div>

                        {/* Keyboard Shortcut */}
                        <div className="absolute bottom-1 left-1 text-[9px] bg-zinc-700/80 px-1.5 py-0.5 rounded-md text-zinc-300 font-mono z-30 font-bold">
                            {i + 1}
                        </div>
                    </motion.button>
                );
            })}

            {/* Tooltip */}
            {tooltip && (() => {
                const skill = SKILLS.find(s => s.id === tooltip);
                if (!skill) return null;
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-black/90 backdrop-blur-md border border-white/10 max-w-[250px]"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{skill.icon}</span>
                            <span className="font-bold text-sm text-white">{skill.name}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">{skill.description}</p>
                        <div className="flex gap-2 mt-1">
                            <span className="text-[9px] text-indigo-300 font-mono">💧{skill.manaCost} MP</span>
                            <span className="text-[9px] text-zinc-500 font-mono">⏰{skill.cooldown}s</span>
                        </div>
                    </motion.div>
                );
            })()}
        </div>
    );
};
