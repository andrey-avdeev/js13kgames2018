import { Sprite } from './sprite';
import { Player } from './player';
import { Config } from '../config';

export class Platform extends Sprite {
    constructor(
        game: any,
        public backgroundContext: CanvasRenderingContext2D,
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
        public altitude: number,
        public isConnectedWithPlayer: boolean = false
    ) {
        super(game, x, y, dx, dy, image, color, width, height, "platform", ttl);
    }

    public underTension: boolean = false;
    public onScreen: boolean = true;
    public inConnection: Platform = null;
    public outConnection: Platform = null;
    public wasRegenerated: boolean = true;

    public update() {
        if (!this.outOfBorders()) {
            this.y = this.player.altitude - this.altitude + this.game.canvas.height / 2;

            if (this.dx != 0 || this.dy != 0) {
                this.x += this.dx;
                this.altitude -= this.dy;

                this.applyFriction();
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

    public outOfBorders() {
        if (this.altitude + this.game.canvas.height <= this.player.altitude
            && !this.isConnectedWithPlayer) {
            this.onScreen = false;
            this.destroy();
            return true;
        } else {
            return false;
        }
    }

    public applyFriction() {
        this.dx = this.dx / 2;
        this.dy = this.dy / 2;

        if (Math.round(this.dx) == 0) this.dx = 0;
        if (Math.round(this.dy) == 0) this.dy = 0;
    }

    public destroy() { this.ttl = 0; }

    public render() {
        (this as any).draw();

        if (this.outConnection && !this.outConnection.wasRegenerated) {
            this.backgroundContext.strokeStyle = 'green';
            this.backgroundContext.lineWidth = 2;

            this.backgroundContext.beginPath();
            this.backgroundContext.moveTo(this.outConnection.x + this.outConnection.width / 2, this.outConnection.y + this.outConnection.height / 2);
            this.backgroundContext.lineTo(this.x + this.width / 2, this.y + this.height / 2);
            this.backgroundContext.stroke();
        }
    }
}