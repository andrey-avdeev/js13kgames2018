import { Sprite } from './sprite';
import { Platform } from './platform';
import { Config } from '../config';
import { Game } from '../game';
import { Enemy } from './enemy';

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

        this.lives = Config.PLAYER_LIVES;

        this.image = this.game.engine.assets.images.player;
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

    public jumps: number = 0;
    public connectedPlatforms: number = 1;
    public lives: number = 0;
    public killedEnemies: number = 0;

    public isPositionRefreshing: boolean = false;

    public update(dt) {
        if ((this as any)._ca) (this as any)._ca.update(dt);
        this.checkBorders();
        this.checkControls();
        this.updateMoving();
        this.applyForces();
        this.calculateAltitudes();
        this.updateConnectionLine();

        if (this.altitude <= 0 || this.lastMaxAltitude - Config.GAME_HEIGHT > this.altitude) {
            this.kill();
            if (this.lastPlatform && this.lives > 0) {
                this.refreshPosition();
            } else {
                this.game.gameOver();
            }
        }
    }

    public render() {
        (this as any).draw();

        if (this.lastPlatform) {
            if (!this.game.isExplosionPulseState) {
                this.game.background.context.strokeStyle = 'rgb(0, 30,' + Math.round(this.blue / this.connectionWidth) + ')';
            } else {
                this.game.background.context.strokeStyle = 'red';
            }

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

        if (this.dy <= 0) this.isPositionRefreshing = false;
    }

    public moveLeft() { this.dx -= Config.PLAYER_HORIZONTAL_SPEED; }
    public moveRight() { this.dx += Config.PLAYER_HORIZONTAL_SPEED; }
    public jump() {
        this.dy = Config.PLAYER_JUMP_SPEED;
        this.jumps += 1;
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
        if (!platform.isUnmovable)
            platform.dy = Config.PLATFORM_AFTERJUMP_SPEED;

        platform.animation = 'charged';
        platform.underTension = true;
        platform.isConnectedWithPlayer = true;
        this.preLastPlatform = this.lastPlatform;
        this.lastPlatform = platform;
        this.lastPlatform.wasRegenerated = false;

        if (this.preLastPlatform) {
            this.preLastPlatform.isConnectedWithPlayer = false;
            this.preLastPlatform.wasRegenerated = false;
            if (this.preLastPlatform.id != this.lastPlatform.id) {
                this.connectedPlatforms += 1;
                this.preLastPlatform.animation = 'charged';
            }
        }
        this.lastPlatform.inConnection = this.preLastPlatform;
        if (this.preLastPlatform)
            this.preLastPlatform.outConnection = this.lastPlatform;
    }

    public killEnemy(enemy: Enemy) {
        this.jump();
        this.killedEnemies += 1;
        enemy.explode();
    }

    public kill() {
        this.lives -= 1;
    }

    public refreshPosition() {
        let x0 = this.x;
        let x1 = this.lastPlatform.x;
        let y0 = this.altitude;
        let y1 = this.lastPlatform.altitude;

        this.dx = (x1 - x0) * Config.PLAYER_HORIZONTAL_SPEED * 2 / Config.GAME_WIDTH;
        this.dy = (y1 - y0) * Config.PLAYER_JUMP_SPEED * Config.PLAYER_POSITION_REFRESH_FACTOR / Config.GAME_HEIGHT;
        this.isPositionRefreshing = true;
    }

    public explosionPulse() {

    }
}