import { Game } from "../game";

export abstract class Sprite {
    constructor(
        public game: Game,
        public x: number,
        public y: number,
        public dx: number,
        public dy: number,
        public image: HTMLImageElement,
        public animations:any=null,
        public color: string,
        public width: number,
        public height: number,
        public type: string,
        public ttl: number = Infinity
    ) {
    }
    public id: string = null;
}