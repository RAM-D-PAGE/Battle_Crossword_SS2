declare module 'howler' {
    class Howl {
        constructor(options: {
            src: string[];
            volume?: number;
            loop?: boolean;
            preload?: boolean;
        });
        play(): number;
        stop(id?: number): this;
        pause(id?: number): this;
        mute(muted: boolean, id?: number): this;
        volume(vol?: number, id?: number): this | number;
        fade(from: number, to: number, duration: number, id?: number): this;
        on(event: string, callback: Function, id?: number): this;
        off(event: string, callback?: Function, id?: number): this;
        unload(): void;
    }

    namespace Howler {
        function mute(muted: boolean): typeof Howler;
        function volume(vol?: number): typeof Howler | number;
        function stop(): typeof Howler;
        function unload(): typeof Howler;
    }
}
