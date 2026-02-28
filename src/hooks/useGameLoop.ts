import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useSettingsStore, DIFFICULTY_CONFIG } from '../store/useSettingsStore';
import { ENEMIES } from '../core/data/Enemies';
import { calculateDamage } from '../core/engine/DamageSystem';
import { AudioManager } from '../core/engine/AudioManager';
import { isValidWord, isValidWordSync } from '../core/engine/DictionaryService';
import { WEAPONS } from '../core/data/Weapons';
import { t } from '../core/i18n';

export const useGameLoop = () => {
    const {
        turn,
        isPlayerTurn,
        endTurn,
        damagePlayer,
        damageEnemy,
        healPlayer,
        enemyId,
        gameStatus,
        grid,
        setGrid,
        refillHand,
        playerClass,
        addPopup,
        triggerShake,
        equippedWeapon,
        gainXp,
        combo,
        incrementCombo,
        resetCombo,
        tickStatusEffects,
        applyStatusEffect
    } = useGameStore();

    const { timerEnabled, difficulty, screenShakeEnabled } = useSettingsStore();
    const diffConfig = DIFFICULTY_CONFIG[difficulty];

    const [timer, setTimer] = useState(diffConfig.timerDuration);
    const [message, setMessage] = useState('');
    const [isChecking, setIsChecking] = useState(false);

    const enemyRef = useRef<any>(null);

    // Initialize Enemy
    useEffect(() => {
        if (enemyId) {
            enemyRef.current = ENEMIES.find(e => e.id === enemyId);
        }
    }, [enemyId]);

    // Timer Logic
    useEffect(() => {
        if (gameStatus !== 'battle' || !timerEnabled) return;

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 0) {
                    endTurn();
                    return diffConfig.timerDuration;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [gameStatus, turn, endTurn, timerEnabled, diffConfig.timerDuration]);

    // Reset timer + discard on turn change
    useEffect(() => {
        setTimer(diffConfig.timerDuration);
        // Reset discard allowance each turn
        if (isPlayerTurn) {
            useGameStore.setState({ discardsRemaining: 1 });
        }
    }, [turn, diffConfig.timerDuration, isPlayerTurn]);

    // Enemy Turn Logic — with status effects and special attacks
    useEffect(() => {
        if (!isPlayerTurn && gameStatus === 'battle') {
            const enemy = enemyRef.current;
            if (!enemy) return;

            // Tick player status effects at start of enemy turn
            const effects = tickStatusEffects();

            // Apply burn damage
            if (effects.damage > 0) {
                damagePlayer(effects.damage);
                addPopup(`🔥 -${effects.damage}`, 200, 300, 'orange');
            }
            // Apply poison MP drain
            if (effects.mpDrain > 0) {
                useGameStore.setState(state => ({
                    playerMp: Math.max(0, state.playerMp - effects.mpDrain)
                }));
                addPopup(`☠️ -${effects.mpDrain} MP`, 200, 300, 'green');
            }

            setMessage(`${enemy.name} ${t('battle.attacking')}`);

            const attackDelay = setTimeout(() => {
                const damage = Math.floor(enemy.damage * diffConfig.enemyDamageMultiplier);
                damagePlayer(damage);
                AudioManager.play('damage');
                if (screenShakeEnabled) {
                    triggerShake();
                }

                addPopup(`-${damage}`, 200, 280, 'red');

                // Special attack chance
                if (enemy.special && Math.random() < enemy.special.chance) {
                    applyStatusEffect({
                        type: enemy.special.effect as 'burn' | 'freeze' | 'poison',
                        turnsLeft: enemy.special.duration
                    });
                    addPopup(`💥 ${enemy.special.name}!`, 200, 200, 'red');
                }

                setMessage('');
                endTurn();
                setTimer(diffConfig.timerDuration);
            }, 2000);

            return () => clearTimeout(attackDelay);
        }
    }, [isPlayerTurn, gameStatus, damagePlayer, endTurn, triggerShake, addPopup, diffConfig.enemyDamageMultiplier, screenShakeEnabled, diffConfig.timerDuration, tickStatusEffects, applyStatusEffect]);

    // Game Over Audio
    useEffect(() => {
        if (gameStatus === 'victory') {
            AudioManager.play('victory');
        } else if (gameStatus === 'defeat') {
            AudioManager.play('defeat');
        }
    }, [gameStatus]);

    // Damage preview — sync version (no API, instant)
    const damagePreview = useMemo(() => {
        const wordTiles = grid.filter(t => t !== null) as any[];
        if (wordTiles.length < 2) return 0;

        const word = wordTiles.map((t: any) => t.letter).join('').toLowerCase();
        if (!isValidWordSync(word)) return 0;

        const weapon = WEAPONS.find(w => w.id === equippedWeapon);
        const { totalDamage } = calculateDamage(
            wordTiles,
            'Neutral',
            enemyRef.current?.element,
            playerClass,
            weapon?.bonusDamage || 0,
            combo
        );
        return totalDamage;
    }, [grid, playerClass, equippedWeapon, combo]);

    // Player Actions — ASYNC with hybrid dictionary
    const submitWord = useCallback(async () => {
        if (!isPlayerTurn || isChecking) return;

        const wordTiles = grid.filter(t => t !== null) as any[];

        if (wordTiles.length === 0) {
            setMessage(t('battle.gridEmpty'));
            setTimeout(() => setMessage(''), 1000);
            return;
        }

        const word = wordTiles.map((t: any) => t.letter).join('').toLowerCase();

        // Show "checking" for words not in local dict
        setIsChecking(true);
        setMessage('🔍 Checking...');

        const isValid = await isValidWord(word);
        setIsChecking(false);

        if (isValid) {
            const weapon = WEAPONS.find(w => w.id === equippedWeapon);
            const { totalDamage, isCrit, isEffective, mpGain, healAmount, comboMultiplier } = calculateDamage(
                wordTiles,
                'Neutral',
                enemyRef.current?.element,
                playerClass,
                weapon?.bonusDamage || 0,
                combo
            );

            AudioManager.play('attack');
            incrementCombo();

            // Visual Feedback — Damage
            if (totalDamage > 0) {
                const rX = 150 + Math.random() * 100;
                const rY = 80 + Math.random() * 50;
                const dmgColor = isCrit ? 'yellow' : isEffective ? 'cyan' : 'white';
                addPopup(totalDamage.toString(), rX, rY, dmgColor);

                if (screenShakeEnabled && (isCrit || totalDamage > 30)) {
                    triggerShake();
                }
            }

            // Combo popup
            if (combo > 0) {
                addPopup(`🔥 ${combo + 1}x Combo! (${comboMultiplier.toFixed(1)}x)`, 200, 140, 'orange');
            }

            // Visual Feedback — Heal
            if (healAmount > 0) {
                healPlayer(healAmount);
                addPopup(`+${healAmount} HP`, 100, 300, 'lime');
            }

            // Damage message
            let msg = `${totalDamage} ${t('battle.damageMsg')}`;
            if (isCrit) msg = `${t('battle.critMsg')} ${msg}`;
            if (isEffective) msg = `${t('battle.effectiveMsg')} ${msg}`;
            setMessage(msg);

            damageEnemy(totalDamage);

            // Apply MP gain
            if (mpGain > 0) {
                useGameStore.setState(state => ({
                    playerMp: Math.min(state.playerMaxMp, state.playerMp + mpGain)
                }));
                addPopup(`+${mpGain} MP`, 300, 300, 'mediumpurple');
            }

            // Clear grid and refill hand
            setGrid(Array(7).fill(null));
            refillHand();

            // XP gain from word length
            gainXp(Math.max(3, wordTiles.length * 2));

            // Extra MP from weapon bonusMp
            if (weapon && weapon.bonusMp > 0) {
                useGameStore.setState(state => ({
                    playerMp: Math.min(state.playerMaxMp, state.playerMp + weapon.bonusMp)
                }));
            }

            // End turn
            endTurn();
            setTimer(diffConfig.timerDuration);
        } else {
            // Invalid word — reset combo
            resetCombo();
            setMessage(t('battle.invalidWord'));
            setTimeout(() => setMessage(''), 1500);
        }
    }, [isPlayerTurn, isChecking, grid, equippedWeapon, playerClass, combo, screenShakeEnabled,
        incrementCombo, resetCombo, addPopup, healPlayer, damageEnemy, setGrid, refillHand,
        gainXp, endTurn, triggerShake, diffConfig.timerDuration]);

    return {
        timer,
        message,
        submitWord,
        damagePreview,
        isChecking,
        combo
    };
};
