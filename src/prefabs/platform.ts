import { Sprite } from './sprite';
import { Player } from './player';
import { Config } from '../config';
import { Game } from '../game';

export class Platform extends Sprite {
    constructor(
        game: Game,
        x: number,
        y: number,
        dx: number,
        dy: number,
        ttl: number,
        public altitude: number,
        public isConnectedWithPlayer: boolean = false
    ) {
        super(game, x, y, dx, dy, null, null, 'red', Config.PLATFORM_BASE_WIDTH, Config.PLATFORM_BASE_HEIGHT, "platform", ttl);

        let spriteSheet = game.engine.spriteSheet({
            image: game.engine.assets.images.platform,
            frameWidth: Config.PLATFORM_BASE_WIDTH,
            frameHeight: Config.PLATFORM_BASE_HEIGHT,
            animations: {
                idle: {
                    frames: [0],
                    frameRate: 10,
                    loop: true
                },
                connected: {
                    frames: [1, 2, 1],
                    frameRate: 20,
                    loop: true
                },
                charged: {
                    frames: [3, 4, 3],
                    frameRate: 20,
                    loop: true
                }
            }
        });
        
        this.animations = spriteSheet.animations;
    }

    public underTension: boolean = false;
    public onScreen: boolean = true;
    public inConnection: Platform = null;
    public outConnection: Platform = null;
    public wasRegenerated: boolean = true;

    public update(dt) {
        if ((this as any)._ca) (this as any)._ca.update(dt);
        if (!this.outOfBorders()) {
            this.y = this.game.player.altitude - this.altitude + Config.GAME_HEIGHT / 2;

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
        if (this.altitude + Config.GAME_HEIGHT <= this.game.player.altitude
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
        // (this as any).draw();
        (this as any)._ca.render(this as any);

        if (this.outConnection && !this.outConnection.wasRegenerated) {
            this.game.background.context.strokeStyle = 'green';
            this.game.background.context.lineWidth = 2;

            this.game.background.context.beginPath();
            this.game.background.context.moveTo(this.outConnection.x + 7, this.outConnection.y + 7);
            this.game.background.context.lineTo(this.x + 42, this.y + 7);
            this.game.background.context.stroke();
        }
    }
}