import { Utils } from "../utils";

export abstract class Sprite {
    constructor(
        public game: any,
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
    // public id: number = new Date().getUTCMilliseconds();
    public id: string = null;

    // public animations: object = null;
}