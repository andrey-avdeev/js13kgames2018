import { Sprite } from './sprite';
import { Player } from './player';
import { Config } from '../config';

export class Platform extends Sprite {
    constructor(
        game: any,
        x: number,
        y: number,
        dx: number,
        dy: number,
        image: any,
        color: string,
        width: number,
        height: number,
        ttl: number,
        public player: Player,
        public altitude: number
    ) {
        super(game, x, y, dx, dy, image, color, width, height, "platform", ttl);

    }

    public underTension: boolean = false;
    public onScreen: boolean = true;

    /**
     * update
     */
    public update() {
        // console.log(this.altitude - this.player.altitude);
        if (this.altitude + this.game.canvas.height/2 <= this.player.altitude) {
            this.onScreen = false;
            this.destroy();
        } else {
            this.y = this.player.altitude - this.altitude + this.game.canvas.height / 2;

            if (this.dx != 0 || this.dy != 0) {
                this.x += this.dx;
                this.altitude -= this.dy;

                this.applyInertia();
                this.color = 'brown';
            } else {
                if (this.underTension) {
                    this.color = 'blue';
                } else {
                    this.color = 'red';
                }
            }
        }
    }

    public applyInertia() {
        this.dx = this.dx / 2;
        this.dy = this.dy / 2;

        if (Math.round(this.dx) == 0) this.dx = 0;
        if (Math.round(this.dy) == 0) this.dy = 0;
    }

    public destroy() {
        this.ttl = 0;
    }
}