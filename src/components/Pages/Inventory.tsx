import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Swords, Shield, Sparkles, Plus, X } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { SKILLS } from '../../core/data/Skills';
import { WEAPONS } from '../../core/data/Weapons';
import { t } from '../../core/i18n';

interface InventoryProps {
    onBack: () => void;
}

const MAX_ACTIVE_SLOTS = 6;
const MAX_PASSIVE_SLOTS = 3;

export const Inventory: React.FC<InventoryProps> = ({ onBack }) => {
    const {
        equippedSkills, playerClass, ownedSkills, ownedWeapons,
        equippedWeapon, passiveSkills,
        equipSkill, unequipSkill, equipPassive, unequipPassive,
        equipWeapon, playerLevel
    } = useGameStore();
    const [tab, setTab] = useState<'skills' | 'weapons'>('skills');
    const [pickingSlot, setPickingSlot] = useState<number | null>(null);
    const [pickingType, setPickingType] = useState<'active' | 'passive' | 'weapon' | null>(null);

    const activeSkillData = equippedSkills
        .map(id => SKILLS.find(s => s.id === id))
        .filter(Boolean);

    const passiveSkillData = passiveSkills
        .map(id => SKILLS.find(s => s.id === id))
        .filter(Boolean);

    const currentWeapon = WEAPONS.find(w => w.id === equippedWeapon);

    // Available skills to pick (owned but not already equipped)
    const availableActive = SKILLS.filter(s =>
        s.skillType === 'active' &&
        ownedSkills.includes(s.id) &&
        !equippedSkills.includes(s.id)
    );
    const availablePassive = SKILLS.filter(s =>
        s.skillType === 'passive' &&
        ownedSkills.includes(s.id) &&
        !passiveSkills.includes(s.id)
    );
    const availableWeapons = WEAPONS.filter(w =>
        ownedWeapons.includes(w.id) && w.id !== equippedWeapon
    );

    const handlePickSkill = (skillId: string) => {
        if (pickingType === 'active' && pickingSlot !== null) {
            equipSkill(skillId, pickingSlot);
        } else if (pickingType === 'passive') {
            equipPassive(skillId);
        }
        setPickingSlot(null);
        setPickingType(null);
    };

    const handlePickWeapon = (weaponId: string) => {
        equipWeapon(weaponId);
        setPickingSlot(null);
        setPickingType(null);
    };

    return (
        <div className="game-bg h-[100svh] w-full flex flex-col items-center relative overflow-hidden">
            {/* Back */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={onBack}
                className="absolute top-4 left-4 z-20 p-3 glass-card rounded-xl text-zinc-400 hover:text-white transition-all flex items-center gap-2"
            >
                <ArrowLeft size={18} />
                <span className="text-sm font-bold">{t('menu.back')}</span>
            </motion.button>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center mt-16 mb-6"
            >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white mb-4 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                    <Package size={32} />
                </div>
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    {t('inventory.title')}
                </h2>
                {playerClass && (
                    <p className="text-zinc-500 text-sm mt-1">
                        {playerClass.icon} {playerClass.name} • Lv.{playerLevel}
                    </p>
                )}
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 w-full max-w-lg px-4">
                <button
                    onClick={() => setTab('skills')}
                    className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${tab === 'skills' ? 'bg-cyan-500 text-white' : 'glass-card text-zinc-400'
                        }`}
                >
                    <Sparkles size={14} /> {t('inventory.skills')}
                </button>
                <button
                    onClick={() => setTab('weapons')}
                    className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${tab === 'weapons' ? 'bg-cyan-500 text-white' : 'glass-card text-zinc-400'
                        }`}
                >
                    <Swords size={14} /> {t('inventory.weapons')}
                </button>
            </div>

            {/* Inventory Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-8 w-full max-w-lg space-y-6">
                {tab === 'skills' ? (
                    <>
                        {/* Active Skill Slots */}
                        <div>
                            <h3 className="text-sm font-bold text-indigo-300 mb-3 flex items-center gap-2">
                                ⚡ {t('inventory.activeSkills')}
                                <span className="text-[10px] text-zinc-500 font-mono">{activeSkillData.length}/{MAX_ACTIVE_SLOTS}</span>
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {Array.from({ length: MAX_ACTIVE_SLOTS }).map((_, i) => {
                                    const skill = activeSkillData[i];
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            onClick={() => {
                                                if (skill) {
                                                    unequipSkill(i);
                                                } else {
                                                    setPickingSlot(i);
                                                    setPickingType('active');
                                                }
                                            }}
                                            className={`glass-card rounded-xl p-3 flex flex-col items-center gap-1.5 min-h-[100px] justify-center transition-all cursor-pointer
                                                ${skill ? 'border-indigo-500/20 hover:border-red-500/30' : 'border-dashed border-zinc-700/50 hover:border-indigo-500/30'}`}
                                        >
                                            {skill ? (
                                                <>
                                                    <span className="text-2xl">{skill.icon}</span>
                                                    <span className="text-[10px] font-bold text-white text-center">{skill.name}</span>
                                                    <span className="text-[8px] text-zinc-500 font-mono">
                                                        {skill.manaCost}MP • {skill.cooldown}s
                                                    </span>
                                                    <span className="text-[8px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 font-mono">
                                                        [{i + 1}]
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus size={20} className="text-zinc-700" />
                                                    <span className="text-[9px] text-zinc-700">{t('inventory.emptySlot')}</span>
                                                </>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Passive Skill Slots */}
                        <div>
                            <h3 className="text-sm font-bold text-emerald-300 mb-3 flex items-center gap-2">
                                🔮 {t('inventory.passiveSkills')}
                                <span className="text-[10px] text-zinc-500 font-mono">{passiveSkillData.length}/{MAX_PASSIVE_SLOTS}</span>
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {Array.from({ length: MAX_PASSIVE_SLOTS }).map((_, i) => {
                                    const skill = passiveSkillData[i];
                                    return (
                                        <motion.div
                                            key={`p-${i}`}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 + i * 0.05 }}
                                            onClick={() => {
                                                if (skill) {
                                                    unequipPassive(skill.id);
                                                } else {
                                                    setPickingSlot(i);
                                                    setPickingType('passive');
                                                }
                                            }}
                                            className={`glass-card rounded-xl p-3 flex flex-col items-center gap-1.5 min-h-[100px] justify-center transition-all cursor-pointer
                                                ${skill ? 'border-emerald-500/20 hover:border-red-500/30' : 'border-dashed border-zinc-700/50 hover:border-emerald-500/30'}`}
                                        >
                                            {skill ? (
                                                <>
                                                    <span className="text-2xl">{skill.icon}</span>
                                                    <span className="text-[10px] font-bold text-white text-center">{skill.name}</span>
                                                    <span className="text-[8px] text-emerald-400 text-center leading-tight">
                                                        {skill.description}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus size={20} className="text-zinc-700" />
                                                    <span className="text-[9px] text-zinc-700">{t('inventory.emptySlot')}</span>
                                                </>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                ) : (
                    /* Weapon Slot */
                    <div>
                        <h3 className="text-sm font-bold text-amber-300 mb-3 flex items-center gap-2">
                            ⚔️ {t('inventory.weaponSlot')}
                        </h3>
                        <div
                            onClick={() => { setPickingSlot(0); setPickingType('weapon'); }}
                            className="glass-card rounded-xl p-6 flex flex-col items-center gap-3 border-amber-500/20 cursor-pointer hover:border-amber-400/40 transition-all"
                        >
                            {currentWeapon ? (
                                <>
                                    <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center">
                                        <span className="text-4xl">{currentWeapon.icon}</span>
                                    </div>
                                    <span className="font-bold text-white">{currentWeapon.name}</span>
                                    <span className="text-xs text-zinc-400 text-center">{currentWeapon.description}</span>
                                    <div className="flex gap-3">
                                        <span className="text-xs glass-card px-3 py-1 rounded-lg text-red-300">⚔️ +{currentWeapon.bonusDamage} DMG</span>
                                        <span className="text-xs glass-card px-3 py-1 rounded-lg text-purple-300">💧 +{currentWeapon.bonusMp} MP</span>
                                    </div>
                                    {currentWeapon.passiveEffect && (
                                        <span className="text-[10px] text-emerald-300">✨ {currentWeapon.passiveEffect}</span>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Plus size={32} className="text-zinc-600" />
                                    <span className="text-sm text-zinc-500">{t('inventory.emptySlot')}</span>
                                </>
                            )}
                        </div>

                        {/* Accessory Slot (locked) */}
                        <h3 className="text-sm font-bold text-zinc-500 mb-3 mt-6 flex items-center gap-2">
                            💍 {t('inventory.accessorySlot')}
                            <span className="text-[10px] text-zinc-600 font-mono">Lv.5</span>
                        </h3>
                        <div className={`glass-card rounded-xl p-6 flex flex-col items-center gap-3 border-dashed ${playerLevel >= 5 ? 'opacity-100' : 'opacity-40'
                            }`}>
                            <Shield size={32} className="text-zinc-600" />
                            <span className="text-xs text-zinc-600">{playerLevel >= 5 ? t('inventory.emptySlot') : t('inventory.lockedSlot')}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Picker Modal */}
            {pickingType && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center p-4"
                    onClick={() => { setPickingType(null); setPickingSlot(null); }}
                >
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        onClick={e => e.stopPropagation()}
                        className="glass-card rounded-t-2xl rounded-b-xl p-4 max-w-lg w-full max-h-[60vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-bold text-white">
                                {pickingType === 'active' ? '⚡ Pick Active Skill' :
                                    pickingType === 'passive' ? '🔮 Pick Passive Skill' : '⚔️ Pick Weapon'}
                            </h3>
                            <button onClick={() => { setPickingType(null); setPickingSlot(null); }} className="text-zinc-400">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {pickingType === 'weapon' ? (
                                availableWeapons.map(w => (
                                    <button
                                        key={w.id}
                                        onClick={() => handlePickWeapon(w.id)}
                                        className="glass-card rounded-xl p-3 flex flex-col items-center gap-1.5 hover:border-amber-500/30 transition-all"
                                    >
                                        <span className="text-2xl">{w.icon}</span>
                                        <span className="text-[10px] font-bold text-white">{w.name}</span>
                                        <span className="text-[8px] text-zinc-500">+{w.bonusDamage} DMG</span>
                                    </button>
                                ))
                            ) : (
                                (pickingType === 'active' ? availableActive : availablePassive).map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => handlePickSkill(s.id)}
                                        className="glass-card rounded-xl p-3 flex flex-col items-center gap-1.5 hover:border-indigo-500/30 transition-all"
                                    >
                                        <span className="text-2xl">{s.icon}</span>
                                        <span className="text-[10px] font-bold text-white">{s.name}</span>
                                        <span className="text-[8px] text-zinc-500">{s.skillType === 'active' ? `${s.manaCost}MP` : 'Passive'}</span>
                                    </button>
                                ))
                            )}
                            {((pickingType === 'weapon' && availableWeapons.length === 0) ||
                                (pickingType === 'active' && availableActive.length === 0) ||
                                (pickingType === 'passive' && availablePassive.length === 0)) && (
                                    <div className="col-span-3 py-8 text-center text-zinc-600 text-sm">
                                        No items available — buy from the Skill Shop!
                                    </div>
                                )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};
