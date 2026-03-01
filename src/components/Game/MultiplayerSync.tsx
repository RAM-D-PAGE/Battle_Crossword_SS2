import React, { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { subscribeToRoom, getPlayerId, unsubscribe } from '../../core/services/MultiplayerService';

export const MultiplayerSync: React.FC = () => {
    const { isMultiplayer, multiplayerRoomId, damagePlayer } = useGameStore();

    useEffect(() => {
        if (!isMultiplayer || !multiplayerRoomId) return;

        const myId = getPlayerId();

        const channel = subscribeToRoom(multiplayerRoomId, {
            onAction: (action) => {
                if (action.player_id === myId) return;

                if (action.action_type === 'damage') {
                    // we took damage from the opponent!
                    if (action.payload.target_id === myId || action.payload.target_id === 'all') {
                        damagePlayer(action.payload.amount);
                        // Using state.addPopup directly to guarantee latest function ref
                        useGameStore.getState().addPopup(`-${action.payload.amount}`, 150, 200, 'red');
                    }
                }

                if (action.action_type === 'word_submit') {
                    // Turn passes to me
                    useGameStore.setState({ isPlayerTurn: true });
                }
            },
            onPlayerUpdate: (player) => {
                if (player.player_id !== myId) {
                    // Update enemy Hp
                    useGameStore.setState({ enemyHp: player.hp });
                }
            }
        });

        return () => {
            unsubscribe(channel);
        };
    }, [isMultiplayer, multiplayerRoomId, damagePlayer]);

    return null;
};
