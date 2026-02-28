import { Howl, Howler } from 'howler';

// Define SFX keys
export type SoundEffect = 'tile_click' | 'tile_place' | 'attack' | 'damage' | 'heal' | 'victory' | 'defeat' | 'bgm_battle' | 'spell_cast';

class AudioSystem {
    private sounds: Record<SoundEffect, Howl>;
    private bgmId: number | null = null;
    private isMuted: boolean = false;

    constructor() {
        this.sounds = {
            tile_click: new Howl({ src: ['/sounds/click.mp3'], volume: 0.5 }),
            tile_place: new Howl({ src: ['/sounds/clack.mp3'], volume: 0.6 }),
            attack: new Howl({ src: ['/sounds/slash.mp3'], volume: 0.7 }),
            damage: new Howl({ src: ['/sounds/hit.mp3'], volume: 1.0 }),
            heal: new Howl({ src: ['/sounds/heal.mp3'], volume: 0.6 }),
            spell_cast: new Howl({ src: ['/sounds/spell.mp3'], volume: 0.7 }),
            victory: new Howl({ src: ['/sounds/victory.mp3'], volume: 0.8 }),
            defeat: new Howl({ src: ['/sounds/defeat.mp3'], volume: 0.8 }),
            bgm_battle: new Howl({ src: ['/sounds/battle_theme.mp3'], volume: 0.3, loop: true }),
        };
    }

    play(sfx: SoundEffect) {
        if (this.isMuted) return;
        
        // Stop previous BGM if playing new BGM
        if (sfx === 'bgm_battle') {
            if (!this.bgmId) {
                this.bgmId = this.sounds[sfx].play();
            }
            return;
        }

        this.sounds[sfx].play();
    }

    stopBGM() {
        if (this.bgmId) {
            this.sounds.bgm_battle.stop(this.bgmId);
            this.bgmId = null;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        Howler.mute(this.isMuted);
        return this.isMuted;
    }
}

export const AudioManager = new AudioSystem();
