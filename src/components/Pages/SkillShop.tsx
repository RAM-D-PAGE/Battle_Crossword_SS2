import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import { SKILLS } from '../../core/data/Skills';
import { WEAPONS } from '../../core/data/Weapons';
import { useGameStore } from '../../store/useGameStore';
import { t } from '../../core/i18n';
import { SkillData, WeaponData } from '../../core/types';

interface SkillShopProps {
    onBack: () => void;
}

const TIER_COLORS = ['', 'border-zinc-500/30', 'border-indigo-500/30', 'border-amber-500/30'];
const TIER_LABELS = ['', '★', '★★', '★★★'];

export const SkillShop: React.FC<SkillShopProps> = ({ onBack }) => {
    const [tab, setTab] = useState<'skills' | 'weapons'>('skills');
    const [filter, setFilter] = useState<'all' | 'active' | 'passive'>('all');
    const [selectedItem, setSelectedItem] = useState<SkillData | WeaponData | null>(null);
    const [buyMsg, setBuyMsg] = useState('');

    const { playerClass, gold, ownedSkills, ownedWeapons, buySkill, buyWeapon } = useGameStore();

    const shopSkills = SKILLS.filter(s => {
        if (s.classRestriction && s.classRestriction !== playerClass?.id) return false;
        if (filter === 'active' && s.skillType !== 'active') return false;
        if (filter === 'passive' && s.skillType !== 'passive') return false;
        return true;
    });

    const ownedSkill = (id: string) => ownedSkills.includes(id);
    const ownedWeapon = (id: string) => ownedWeapons.includes(id);

    const handleBuy = () => {
        if (!selectedItem) return;
        let success = false;
        if ('skillType' in selectedItem) {
            success = buySkill(selectedItem.id);
        } else {
            success = buyWeapon(selectedItem.id);
        }
        if (success) {
            setBuyMsg('✅');
            setTimeout(() => { setBuyMsg(''); setSelectedItem(null); }, 800);
        } else {
            setBuyMsg('❌ Not enough gold');
            setTimeout(() => setBuyMsg(''), 1500);
        }
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

            {/* Gold Display */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-4 right-4 z-20 px-4 py-2 glass-card rounded-xl flex items-center gap-2"
            >
                <span className="text-lg">💰</span>
                <span className="font-mono font-bold text-yellow-300">{gold}</span>
            </motion.div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center mt-16 mb-4"
            >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white mb-4 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                    <ShoppingBag size={32} />
                </div>
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {t('shop.title')}
                </h2>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2 mb-3 w-full max-w-lg px-4">
                <button
                    onClick={() => setTab('skills')}
                    className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${tab === 'skills' ? 'bg-purple-500 text-white' : 'glass-card text-zinc-400'}`}
                >
                    ✨ {t('shop.skills')}
                </button>
                <button
                    onClick={() => setTab('weapons')}
                    className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${tab === 'weapons' ? 'bg-purple-500 text-white' : 'glass-card text-zinc-400'}`}
                >
                    ⚔️ {t('shop.weapons')}
                </button>
            </div>

            {/* Skill Type Filter */}
            {tab === 'skills' && (
                <div className="flex gap-2 mb-3 px-4">
                    {(['all', 'active', 'passive'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                        >
                            {f === 'all' ? t('shop.all') : f === 'active' ? t('shop.active') : t('shop.passive')}
                        </button>
                    ))}
                </div>
            )}

            {/* Item Grid */}
            <div className="flex-1 overflow-y-auto px-4 pb-8 w-full max-w-lg">
                <div className="grid grid-cols-2 gap-3">
                    {tab === 'skills' ? (
                        shopSkills.map((skill, i) => (
                            <motion.button
                                key={skill.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.04 }}
                                whileHover={{ scale: 1.03 }}
                                onClick={() => setSelectedItem(skill)}
                                className={`glass-card rounded-xl p-4 flex flex-col items-center gap-2 relative overflow-hidden transition-all
                                    ${TIER_COLORS[skill.tier]} ${ownedSkill(skill.id) ? 'opacity-60' : 'hover:border-purple-500/30'}`}
                            >
                                <div className={`absolute top-0 left-0 right-0 h-1 ${skill.skillType === 'passive' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                                <span className="text-3xl">{skill.icon}</span>
                                <span className="font-bold text-xs text-white text-center">{skill.name}</span>
                                <span className="text-[9px] text-zinc-500 text-center leading-tight line-clamp-2">{skill.description}</span>
                                <div className="flex items-center gap-2 mt-1">
                                    {ownedSkill(skill.id) ? (
                                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1"><Check size={10} /> {t('shop.owned')}</span>
                                    ) : skill.cost === 0 ? (
                                        <span className="text-[10px] text-yellow-300 font-bold">{t('shop.free')}</span>
                                    ) : (
                                        <span className="text-[10px] text-yellow-300 font-mono font-bold">💰 {skill.cost}</span>
                                    )}
                                    <span className="text-[9px] text-zinc-600">{TIER_LABELS[skill.tier]}</span>
                                </div>
                            </motion.button>
                        ))
                    ) : (
                        WEAPONS.map((weapon, i) => (
                            <motion.button
                                key={weapon.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.04 }}
                                whileHover={{ scale: 1.03 }}
                                onClick={() => setSelectedItem(weapon)}
                                className={`glass-card rounded-xl p-4 flex flex-col items-center gap-2 relative overflow-hidden transition-all
                                    ${TIER_COLORS[weapon.tier]} ${ownedWeapon(weapon.id) ? 'opacity-60' : 'hover:border-purple-500/30'}`}
                            >
                                <span className="text-3xl">{weapon.icon}</span>
                                <span className="font-bold text-xs text-white text-center">{weapon.name}</span>
                                <span className="text-[9px] text-zinc-500 text-center leading-tight line-clamp-2">{weapon.description}</span>
                                <div className="flex items-center gap-2 mt-1">
                                    {ownedWeapon(weapon.id) ? (
                                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1"><Check size={10} /> {t('shop.owned')}</span>
                                    ) : (
                                        <span className="text-[10px] text-yellow-300 font-mono font-bold">💰 {weapon.cost}</span>
                                    )}
                                    <span className="text-[9px] text-zinc-600">{TIER_LABELS[weapon.tier]}</span>
                                </div>
                            </motion.button>
                        ))
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="glass-card rounded-2xl p-6 max-w-sm w-full"
                        >
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-6xl">{selectedItem.icon}</span>
                                <h3 className="text-xl font-black text-white">{selectedItem.name}</h3>
                                <p className="text-sm text-zinc-400 text-center">{selectedItem.description}</p>

                                {'skillType' in selectedItem && (
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${selectedItem.skillType === 'passive' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'
                                        }`}>
                                        {selectedItem.skillType === 'passive' ? '🔮 Passive' : '⚡ Active'}
                                    </div>
                                )}

                                {'manaCost' in selectedItem && (selectedItem as SkillData).manaCost > 0 && (
                                    <div className="flex gap-3">
                                        <span className="text-xs glass-card px-3 py-1 rounded-lg">💧 {(selectedItem as SkillData).manaCost} MP</span>
                                        <span className="text-xs glass-card px-3 py-1 rounded-lg">⏰ {(selectedItem as SkillData).cooldown}s CD</span>
                                    </div>
                                )}

                                {'bonusDamage' in selectedItem && (
                                    <div className="flex gap-3">
                                        <span className="text-xs glass-card px-3 py-1 rounded-lg">⚔️ +{(selectedItem as WeaponData).bonusDamage} DMG</span>
                                        <span className="text-xs glass-card px-3 py-1 rounded-lg">💧 +{(selectedItem as WeaponData).bonusMp} MP</span>
                                    </div>
                                )}

                                {('passiveEffect' in selectedItem) && selectedItem.passiveEffect && (
                                    <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs text-center">
                                        ✨ {selectedItem.passiveEffect}
                                    </div>
                                )}

                                <div className="flex gap-3 mt-2 w-full">
                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 font-bold text-sm"
                                    >
                                        {t('settings.close')}
                                    </button>
                                    {(('skillType' in selectedItem && !ownedSkill(selectedItem.id)) ||
                                        ('bonusDamage' in selectedItem && !ownedWeapon(selectedItem.id))) && (
                                            <button
                                                onClick={handleBuy}
                                                disabled={gold < selectedItem.cost}
                                                className={`flex-1 py-2.5 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(168,85,247,0.3)] ${gold >= selectedItem.cost
                                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                                        : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                                                    }`}
                                            >
                                                {buyMsg || `💰 ${t('shop.buy')} ${selectedItem.cost > 0 ? selectedItem.cost : t('shop.free')}`}
                                            </button>
                                        )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
