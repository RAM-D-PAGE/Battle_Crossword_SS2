import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TileData, ClassData } from '../core/types';
import { ENEMIES } from '../core/data/Enemies';
import { SKILLS } from '../core/data/Skills';
import { CLASSES } from '../core/data/Classes';
import { WEAPONS } from '../core/data/Weapons';
import { TileSystem } from '../core/engine/TileSystem';
import { AudioManager } from '../core/engine/AudioManager';

interface GameState {
    hand: TileData[];
    grid: (TileData | null)[];
    score: number;

    // Battle State
    playerHp: number;
    playerMaxHp: number;
    playerMp: number;
    playerMaxMp: number;

    enemyId: string | null;
    enemyHp: number;
    enemyMaxHp: number;

    turn: number;
    isPlayerTurn: boolean;
    gameStatus: 'idle' | 'battle' | 'victory' | 'defeat';
    skillCooldowns: Record<string, number>;
    equippedSkills: string[];
    playerClass?: ClassData;

    // ═══ COMBO SYSTEM ═══
    combo: number;
    discardsRemaining: number;

    // ═══ STATUS EFFECTS ═══
    statusEffects: { type: 'burn' | 'freeze' | 'poison'; turnsLeft: number }[];

    // ═══ GOLD SYSTEM ═══
    gold: number;

    // ═══ XP / LEVEL SYSTEM ═══
    playerXp: number;
    playerLevel: number;
    xpToNextLevel: number;

    // ═══ INVENTORY & EQUIPMENT ═══
    ownedSkills: string[];     // All skill IDs player owns
    ownedWeapons: string[];    // All weapon IDs player owns
    equippedWeapon: string | null;
    passiveSkills: string[];   // Passive skill slots (max 3)

    // Progression
    currentLevel: number;
    currentEnemyIndex: number;
    nextLevel: () => void;

    // Visuals
    screenShake: boolean;
    triggerShake: () => void;

    // Actions
    setHand: (hand: TileData[]) => void;
    setGrid: (grid: (TileData | null)[]) => void;
    addTileToHand: (tile: TileData) => void;
    removeTileFromHand: (id: string) => void;
    placeTile: (tileId: string, slotIndex: number) => void;
    returnTileToHand: (tileId: string) => void;

    startBattle: (enemyId: string) => void;
    endTurn: () => void;
    damageEnemy: (amount: number) => void;
    damagePlayer: (amount: number) => void;
    healPlayer: (amount: number) => void;
    spendMana: (amount: number) => boolean;
    refillHand: () => void;
    castSkill: (skillId: string) => void;
    initializeGame: (classId: string) => void;
    continueGame: () => void;

    // Gold & Shop Actions
    addGold: (amount: number) => void;
    buySkill: (skillId: string) => boolean;
    buyWeapon: (weaponId: string) => boolean;

    // Equip Actions
    equipSkill: (skillId: string, slot: number) => void;
    unequipSkill: (slot: number) => void;
    equipPassive: (skillId: string) => void;
    unequipPassive: (skillId: string) => void;
    equipWeapon: (weaponId: string) => void;
    unequipWeapon: () => void;

    // XP Actions
    gainXp: (amount: number) => void;

    // Combo/Discard Actions
    incrementCombo: () => void;
    resetCombo: () => void;
    discardTile: (tileId: string) => void;
    applyStatusEffect: (effect: { type: 'burn' | 'freeze' | 'poison'; turnsLeft: number }) => void;
    tickStatusEffects: () => { damage: number; skipTurn: boolean; mpDrain: number };

    popups: { id: string; text: string; x: number; y: number; color: string }[];
    addPopup: (text: string, x: number, y: number, color?: string) => void;
    removePopup: (id: string) => void;

    resetGame: () => void;

    // Tap-to-place
    _selectedTileId: string | null;
}

// XP required for each level (cumulative formula)
function xpForLevel(level: number): number {
    return Math.floor(100 * Math.pow(level, 1.5));
}

// Gold reward for defeating an enemy at a given level
function goldReward(level: number): number {
    return 50 + level * 25;
}

// XP reward for defeating an enemy
function xpReward(level: number): number {
    return 30 + level * 15;
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            hand: TileSystem.fillHand([], 7, 2),
            grid: Array(7).fill(null),
            score: 0,

            // Battle Defaults
            playerHp: 100,
            playerMaxHp: 100,
            playerMp: 50,
            playerMaxMp: 100,
            enemyId: null,
            enemyHp: 0,
            enemyMaxHp: 0,
            turn: 1,
            isPlayerTurn: true,
            gameStatus: 'idle',
            skillCooldowns: {},
            equippedSkills: ['fireball', 'ice_shard', 'lightning_bolt', 'heal', 'shadow_bolt', 'shuffle'],

            // ═══ COMBO ═══
            combo: 0,
            discardsRemaining: 1,
            statusEffects: [],

            // ═══ GOLD ═══
            gold: 0,

            // ═══ XP / LEVEL ═══
            playerXp: 0,
            playerLevel: 1,
            xpToNextLevel: xpForLevel(1),

            // ═══ INVENTORY ═══
            ownedSkills: [],
            ownedWeapons: ['wooden_staff'],
            equippedWeapon: 'wooden_staff',
            passiveSkills: [],

            // Progression Defaults
            currentLevel: 1,
            currentEnemyIndex: 0,

            // Visual Defaults
            screenShake: false,

            // Tap-to-place
            _selectedTileId: null as string | null,

            triggerShake: () => {
                set({ screenShake: true });
                setTimeout(() => set({ screenShake: false }), 500);
            },

            setHand: (hand) => set({ hand }),
            setGrid: (grid) => set({ grid }),

            addTileToHand: (tile) => {
                AudioManager.play('tile_click');
                set((state) => ({ hand: [...state.hand, tile] }));
            },
            removeTileFromHand: (id) => set((state) => ({
                hand: state.hand.filter(t => t.id !== id)
            })),

            placeTile: (tileId: string, slotIndex: number) => {
                AudioManager.play('tile_place');
                set((state) => {
                    const tileIndex = state.hand.findIndex(t => t.id === tileId);
                    if (tileIndex === -1) return {};

                    const tile = state.hand[tileIndex];
                    const newHand = [...state.hand];
                    newHand.splice(tileIndex, 1);

                    const newGrid = [...state.grid];
                    if (newGrid[slotIndex]) {
                        newHand.push(newGrid[slotIndex]!);
                    }
                    newGrid[slotIndex] = tile;

                    return { hand: newHand, grid: newGrid };
                });
            },

            returnTileToHand: (tileId: string) => set((state) => {
                const gridIndex = state.grid.findIndex(t => t?.id === tileId);
                if (gridIndex === -1) return {};

                const tile = state.grid[gridIndex]!;
                const newGrid = [...state.grid];
                newGrid[gridIndex] = null;

                return {
                    grid: newGrid,
                    hand: [...state.hand, tile]
                };
            }),

            startBattle: (enemyId: string) => {
                AudioManager.play('bgm_battle');
                const enemyIndex = ENEMIES.findIndex(e => e.id === enemyId);
                const enemy = ENEMIES[enemyIndex !== -1 ? enemyIndex : 0];
                if (!enemy) return;

                set({
                    currentLevel: 1,
                    currentEnemyIndex: enemyIndex !== -1 ? enemyIndex : 0,
                    enemyId: enemy.id,
                    enemyHp: enemy.maxHp,
                    enemyMaxHp: enemy.maxHp,
                    playerHp: 100,
                    playerMp: 50,
                    turn: 1,
                    isPlayerTurn: true,
                    gameStatus: 'battle',
                    hand: TileSystem.fillHand([], 7, 2),
                    grid: Array(7).fill(null),
                    score: 0
                });
            },

            nextLevel: () => {
                const state = get();
                const nextIndex = state.currentEnemyIndex + 1;

                if (nextIndex >= ENEMIES.length) {
                    return;
                }

                const nextEnemy = ENEMIES[nextIndex];
                const healAmount = Math.floor(state.playerMaxHp * 0.3);
                const newHp = Math.min(state.playerMaxHp, state.playerHp + healAmount);

                // Rewards for clearing the level
                const earnedGold = goldReward(state.currentLevel);
                const earnedXp = xpReward(state.currentLevel);

                set({
                    currentLevel: state.currentLevel + 1,
                    currentEnemyIndex: nextIndex,
                    enemyId: nextEnemy.id,
                    enemyHp: nextEnemy.maxHp,
                    enemyMaxHp: nextEnemy.maxHp,
                    playerHp: newHp,
                    turn: 1,
                    isPlayerTurn: true,
                    gameStatus: 'battle',
                    hand: TileSystem.fillHand([], 7, 2),
                    grid: Array(7).fill(null),
                    score: state.score + 1000,
                    gold: state.gold + earnedGold,
                });

                // Gain XP (triggers level up check)
                setTimeout(() => get().gainXp(earnedXp), 100);

                AudioManager.play('bgm_battle');
            },

            endTurn: () => set((state) => ({
                turn: state.turn + 1,
                isPlayerTurn: !state.isPlayerTurn
            })),

            damageEnemy: (amount) => set((state) => {
                const newHp = Math.max(0, state.enemyHp - amount);
                const justDefeated = newHp === 0 && state.enemyHp > 0;

                // Gold + XP on enemy defeat
                let goldBonus = 0;
                let newState: Partial<GameState> = {
                    enemyHp: newHp,
                    gameStatus: newHp === 0 ? 'victory' : state.gameStatus
                };

                if (justDefeated) {
                    goldBonus = goldReward(state.currentLevel);
                    newState.gold = state.gold + goldBonus;
                    // XP gain handled via setTimeout to avoid nested set
                    setTimeout(() => get().gainXp(xpReward(state.currentLevel)), 50);
                }

                return newState;
            }),

            damagePlayer: (amount) => set((state) => {
                // Apply weapon passive damage reduction (simplified)
                let finalAmount = amount;
                const weapon = WEAPONS.find(w => w.id === state.equippedWeapon);
                if (weapon && weapon.bonusDamage > 0) {
                    // Small damage reduction from having a weapon
                    finalAmount = Math.max(1, finalAmount - Math.floor(weapon.bonusDamage * 0.2));
                }

                const newHp = Math.max(0, state.playerHp - finalAmount);
                return {
                    playerHp: newHp,
                    gameStatus: newHp === 0 ? 'defeat' : state.gameStatus
                };
            }),

            healPlayer: (amount) => set((state) => ({
                playerHp: Math.min(state.playerMaxHp, state.playerHp + amount)
            })),

            spendMana: (amount) => {
                const state = get();
                if (state.playerMp >= amount) {
                    set({ playerMp: state.playerMp - amount });
                    return true;
                }
                return false;
            },

            refillHand: () => set((state) => {
                const newHand = TileSystem.fillHand(state.hand, 7, 2);
                return { hand: newHand };
            }),

            castSkill: (skillId: string) => {
                const state = get();
                const skill = SKILLS.find(s => s.id === skillId);

                if (!skill) return;
                if (state.playerMp < skill.manaCost) return;

                const now = Date.now();
                const lastUsed = state.skillCooldowns[skillId] || 0;
                if (now - lastUsed < skill.cooldown * 1000) return;

                AudioManager.play('spell_cast');
                set({
                    playerMp: state.playerMp - skill.manaCost,
                    skillCooldowns: { ...state.skillCooldowns, [skillId]: now }
                });

                switch (skill.effectType) {
                    case 'Damage':
                        state.damageEnemy(skill.value);
                        state.addPopup(skill.value.toString(), 200 + Math.random() * 50, 80, 'orange');

                        // Soul Harvest: also restores 25 MP
                        if (skill.id === 'soul_harvest') {
                            set((s) => ({ playerMp: Math.min(s.playerMaxMp, s.playerMp + 25) }));
                            state.addPopup('+25 MP', 300, 300, 'mediumpurple');
                        }

                        // Blood Pact: sacrifice 20 HP
                        if (skill.id === 'blood_pact') {
                            set((s) => ({ playerHp: Math.max(1, s.playerHp - 20) }));
                            state.addPopup('-20 HP', 100, 300, 'red');
                        }
                        break;

                    case 'Heal':
                        if (skill.id === 'drain_life') {
                            state.damageEnemy(skill.value);
                            state.addPopup(skill.value.toString(), 200, 80, 'purple');
                        }
                        state.healPlayer(skill.value);
                        state.addPopup(`+${skill.value} HP`, 200, 300, 'lime');
                        break;

                    case 'Buff':
                        state.healPlayer(skill.value);
                        state.addPopup(`Shield +${skill.value}`, 200, 300, 'cyan');
                        break;

                    case 'Utility':
                        if (skill.id === 'shuffle') {
                            set({ hand: TileSystem.fillHand([], 7, 2) });
                            state.addPopup('Shuffled!', 200, 200, 'white');
                        }
                        if (skill.id === 'time_warp') {
                            // Reset all skill cooldowns
                            set({ skillCooldowns: {} });
                            state.addPopup('⏳ Cooldowns Reset!', 200, 200, 'cyan');
                        }
                        break;
                }
            },

            initializeGame: (classId: string) => {
                const selectedClass = CLASSES.find(c => c.id === classId);
                if (!selectedClass) return;

                set({
                    playerClass: selectedClass,
                    playerMaxHp: selectedClass.baseHp,
                    playerHp: selectedClass.baseHp,
                    playerMaxMp: selectedClass.baseMp,
                    playerMp: 50,
                    equippedSkills: selectedClass.startingSkills || [],
                    ownedSkills: [...(selectedClass.startingSkills || [])],
                });
            },

            continueGame: () => {
                const state = get();
                if (state.gameStatus === 'battle') {
                    AudioManager.play('bgm_battle');
                }
            },

            // ═════════════════════════════════════
            // GOLD & SHOP
            // ═════════════════════════════════════
            addGold: (amount) => set((state) => ({
                gold: state.gold + amount
            })),

            buySkill: (skillId: string) => {
                const state = get();
                const skill = SKILLS.find(s => s.id === skillId);
                if (!skill) return false;
                if (state.ownedSkills.includes(skillId)) return false;
                if (state.gold < skill.cost) return false;

                set({
                    gold: state.gold - skill.cost,
                    ownedSkills: [...state.ownedSkills, skillId]
                });
                return true;
            },

            buyWeapon: (weaponId: string) => {
                const state = get();
                const weapon = WEAPONS.find(w => w.id === weaponId);
                if (!weapon) return false;
                if (state.ownedWeapons.includes(weaponId)) return false;
                if (state.gold < weapon.cost) return false;

                set({
                    gold: state.gold - weapon.cost,
                    ownedWeapons: [...state.ownedWeapons, weaponId]
                });
                return true;
            },

            // ═════════════════════════════════════
            // EQUIP / UNEQUIP
            // ═════════════════════════════════════
            equipSkill: (skillId: string, slot: number) => set((state) => {
                if (!state.ownedSkills.includes(skillId)) return {};
                const newSkills = [...state.equippedSkills];
                // Remove if already equipped in another slot
                const existingIdx = newSkills.indexOf(skillId);
                if (existingIdx !== -1) newSkills[existingIdx] = '';
                newSkills[slot] = skillId;
                return { equippedSkills: newSkills.filter(Boolean) };
            }),

            unequipSkill: (slot: number) => set((state) => {
                const newSkills = [...state.equippedSkills];
                newSkills.splice(slot, 1);
                return { equippedSkills: newSkills };
            }),

            equipPassive: (skillId: string) => set((state) => {
                if (state.passiveSkills.length >= 3) return {};
                if (state.passiveSkills.includes(skillId)) return {};
                return { passiveSkills: [...state.passiveSkills, skillId] };
            }),

            unequipPassive: (skillId: string) => set((state) => ({
                passiveSkills: state.passiveSkills.filter(id => id !== skillId)
            })),

            equipWeapon: (weaponId: string) => set((state) => {
                if (!state.ownedWeapons.includes(weaponId)) return {};
                return { equippedWeapon: weaponId };
            }),

            unequipWeapon: () => set({ equippedWeapon: null }),

            // ═════════════════════════════════════
            // XP / LEVEL UP
            // ═════════════════════════════════════
            gainXp: (amount: number) => {
                const state = get();
                let newXp = state.playerXp + amount;
                let newLevel = state.playerLevel;
                let needed = state.xpToNextLevel;

                // Level up loop (can level up multiple times)
                while (newXp >= needed) {
                    newXp -= needed;
                    newLevel++;
                    needed = xpForLevel(newLevel);
                }

                const leveledUp = newLevel > state.playerLevel;
                const hpBonus = (newLevel - state.playerLevel) * 10;
                const mpBonus = (newLevel - state.playerLevel) * 5;

                set({
                    playerXp: newXp,
                    playerLevel: newLevel,
                    xpToNextLevel: needed,
                    playerMaxHp: state.playerMaxHp + hpBonus,
                    playerHp: leveledUp ? state.playerMaxHp + hpBonus : state.playerHp, // Full heal on level up
                    playerMaxMp: state.playerMaxMp + mpBonus,
                    playerMp: leveledUp ? state.playerMaxMp + mpBonus : state.playerMp,
                });

                if (leveledUp) {
                    state.addPopup(`⭐ Level ${newLevel}!`, 200, 200, 'gold');
                }
            },

            // ═════════════════════════════════════
            // COMBO / DISCARD / STATUS EFFECTS
            // ═════════════════════════════════════
            incrementCombo: () => set((state) => ({ combo: state.combo + 1 })),
            resetCombo: () => set({ combo: 0 }),

            discardTile: (tileId: string) => {
                const state = get();
                if (state.discardsRemaining <= 0) return;
                const tileIndex = state.hand.findIndex(t => t.id === tileId);
                if (tileIndex === -1) return;

                const newHand = [...state.hand];
                newHand.splice(tileIndex, 1);
                // Generate a replacement tile
                const filled = TileSystem.fillHand(newHand, 7, 2);
                set({ hand: filled, discardsRemaining: state.discardsRemaining - 1 });
            },

            applyStatusEffect: (effect) => set((state) => ({
                statusEffects: [...state.statusEffects, effect]
            })),

            tickStatusEffects: () => {
                const state = get();
                let damage = 0;
                let skipTurn = false;
                let mpDrain = 0;

                const remaining = state.statusEffects
                    .map(e => {
                        switch (e.type) {
                            case 'burn': damage += 8; break;
                            case 'freeze': skipTurn = true; break;
                            case 'poison': mpDrain += 10; break;
                        }
                        return { ...e, turnsLeft: e.turnsLeft - 1 };
                    })
                    .filter(e => e.turnsLeft > 0);

                set({ statusEffects: remaining });
                return { damage, skipTurn, mpDrain };
            },

            popups: [],
            addPopup: (text, x, y, color = 'white') => set((state) => ({
                popups: [...state.popups, { id: Math.random().toString(), text, x, y, color }]
            })),
            removePopup: (id) => set((state) => ({
                popups: state.popups.filter(p => p.id !== id)
            })),

            resetGame: () => {
                AudioManager.stopBGM();
                localStorage.removeItem('battle-crossword-storage');
                set({
                    gameStatus: 'idle',
                    turn: 1,
                    playerHp: 100,
                    currentLevel: 1,
                    currentEnemyIndex: 0,
                    score: 0,
                    gold: 0,
                    playerXp: 0,
                    playerLevel: 1,
                    xpToNextLevel: xpForLevel(1),
                    ownedSkills: [],
                    ownedWeapons: ['wooden_staff'],
                    equippedWeapon: 'wooden_staff',
                    passiveSkills: [],
                    combo: 0,
                    discardsRemaining: 1,
                    statusEffects: [],
                    hand: TileSystem.fillHand([], 7, 2),
                    grid: Array(7).fill(null)
                });
            }
        }),
        {
            name: 'battle-crossword-storage',
            partialize: (state) => ({
                hand: state.hand,
                grid: state.grid,
                score: state.score,
                playerHp: state.playerHp,
                playerMaxHp: state.playerMaxHp,
                playerMp: state.playerMp,
                playerMaxMp: state.playerMaxMp,
                enemyId: state.enemyId,
                enemyHp: state.enemyHp,
                enemyMaxHp: state.enemyMaxHp,
                turn: state.turn,
                isPlayerTurn: state.isPlayerTurn,
                gameStatus: state.gameStatus,
                skillCooldowns: state.skillCooldowns,
                equippedSkills: state.equippedSkills,
                playerClass: state.playerClass,
                currentLevel: state.currentLevel,
                currentEnemyIndex: state.currentEnemyIndex,
                // New persistent fields
                gold: state.gold,
                playerXp: state.playerXp,
                playerLevel: state.playerLevel,
                xpToNextLevel: state.xpToNextLevel,
                ownedSkills: state.ownedSkills,
                ownedWeapons: state.ownedWeapons,
                equippedWeapon: state.equippedWeapon,
                passiveSkills: state.passiveSkills,
                combo: state.combo,
            }),
        }
    )
);
