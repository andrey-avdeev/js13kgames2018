import { Sprite } from './sprite';
import { Platform } from './platform';
import { Config } from '../config';
import { Game } from '../game';

export class Player extends Sprite {

    constructor(
        game: Game,
        x: number,
        y: number,
        dx: number,
        dy: number,
        public altitude: number
    ) {
        super(game, x, y, dx, dy, null, null, 'black', Config.PLAYER_BASE_WIDTH, Config.PLAYER_BASE_HEIGHT, "player");

        let spriteSheet = this.game.engine.spriteSheet({
            image: this.game.engine.assets.images.player,
            frameWidth: Config.PLAYER_BASE_WIDTH,
            frameHeight: Config.PLAYER_BASE_HEIGHT,
            animations: {
                idle: {
                    frames: [0, 1],
                    frameRate: 10,
                    loop: true
                },
                jump: {
                    frames: [2, 1, 0],
                    frameRate: 10,
                    loop: false
                }
            }
        });

        this.animations = spriteSheet.animations;
    }

    public force: number;
    public movingDirection: number = 0;
    public powerLines: any;
    public localAltitude: number = 0;
    public bottomAltitude: number = 0;
    public lastMaxAltitude: number = 0;
    public previousMaxAltitude: number = 0;
    public preLastPlatform: Platform;
    public lastPlatform: Platform;
    public context: CanvasRenderingContext2D;
    public connectionWidth: number = 1;
    public blue: number = 256;
    public connectionIncrementFactor: number = 1;

    public update(dt) {
        if ((this as any)._ca) (this as any)._ca.update(dt);
        this.checkBorders();
        this.checkControls();
        this.updateMoving();
        this.applyForces();
        this.calculateAltitudes();
        this.updateConnectionLine();


        //TODO - to be removed
        if (this.game.engine.keys.pressed('space') || this.altitude <= 0) this.jump();
    }

    public render() {
        (this as any)._ca.render(this as any);

        if (this.lastPlatform) {
            this.game.background.context.strokeStyle = 'rgb(0, 30,' + Math.round(this.blue / this.connectionWidth) + ')';
            this.game.background.context.lineWidth = this.connectionWidth;

            this.game.background.context.beginPath();
            this.game.background.context.moveTo(this.lastPlatform.x + 42, this.lastPlatform.y + 7);
            this.game.background.context.lineTo(this.x + 13, this.y + 22);
            this.game.background.context.stroke();
        }
    }

    public checkBorders() {
        if (this.x + this.width > this.game.engine.canvas.width) this.x = this.game.engine.canvas.width - this.width;
        if (this.x < 0) this.x = 0;
    }

    public checkControls() {
        if (this.game.engine.keys.pressed('left') || this.movingDirection < 0) {
            this.moveLeft();
        }
        else if (this.game.engine.keys.pressed('right') || this.movingDirection > 0) {
            this.moveRight();
        }
    }

    public updateMoving() {
        this.x += this.dx;
        this.altitude += this.dy;
    }

    public moveLeft() { this.dx -= Config.PLAYER_HORIZONTAL_SPEED; }
    public moveRight() { this.dx += Config.PLAYER_HORIZONTAL_SPEED; }
    public jump() {
        this.dy = Config.PLAYER_JUMP_SPEED;
        (this as any).playAnimation('jump');
    }

    public applyForces() {
        this.applyGravity();
        this.applyFriction();
    }

    public applyFriction() {
        this.dx = this.dx * Config.WORLD_FRICTION_FACTOR;
        if (Math.round(this.dx) == 0) this.dx = 0;
    }

    public applyGravity() { this.dy -= Config.WORLD_GRAVITY_FACTOR; }

    public calculateAltitudes() {
        this.previousMaxAltitude = this.lastMaxAltitude;
        this.lastMaxAltitude = (this.altitude > this.lastMaxAltitude) ? this.altitude : this.lastMaxAltitude;
    }

    public updateConnectionLine() {
        let game = this.game;
        setTimeout(() => {
            if (game.player.connectionWidth > 5 || game.player.connectionWidth <= 0)
                game.player.connectionIncrementFactor *= -1;

            game.player.connectionWidth += 1 * game.player.connectionIncrementFactor;
        }, 2000)
    }

    public jumpOffPlatform(platform: Platform) {
        this.jump();
        platform.dy = Config.PLATFORM_AFTERJUMP_SPEED;
        (platform as any).playAnimation('connected');
        platform.underTension = true;
        platform.isConnectedWithPlayer = true;
        this.preLastPlatform = this.lastPlatform;
        this.lastPlatform = platform;
        this.lastPlatform.wasRegenerated = false;

        if (this.preLastPlatform) {
            this.preLastPlatform.isConnectedWithPlayer = false;
            this.preLastPlatform.wasRegenerated = false;
            if (this.preLastPlatform.id != this.lastPlatform.id)
                (this.preLastPlatform as any).playAnimation('charged');
        }
        this.lastPlatform.inConnection = this.preLastPlatform;
        if (this.preLastPlatform)
            this.preLastPlatform.outConnection = this.lastPlatform;
    }
}