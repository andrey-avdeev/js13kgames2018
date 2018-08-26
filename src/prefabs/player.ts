import { Sprite } from './sprite';
import { Platform } from './platform';
import { Config } from '../config';

export class Player extends Sprite {

    constructor(
        game: any,
        x: number,
        y: number,
        dx: number,
        dy: number,
        image: any,
        animations: any,
        color: string,
        width: number,
        height: number,
        public altitude: number
    ) {
        super(game, x, y, dx, dy, image, animations, color, width, height, "player");
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
    public backgroundContext: CanvasRenderingContext2D;

    public update(dt) {
        if ((this as any)._ca) (this as any)._ca.update(dt);
        this.checkBorders();
        this.checkControls();
        this.updateMoving();
        this.applyForces();
        this.calculateAltitudes();

        //TODO - to be removed
        if (this.game.keys.pressed('space') || this.altitude <= 0) this.jump();
    }

    public render() {
        (this as any)._ca.render(this as any);

        if (this.lastPlatform) {
            this.backgroundContext.strokeStyle = 'blue';
            this.backgroundContext.lineWidth = 2;

            this.backgroundContext.beginPath();
            this.backgroundContext.moveTo(this.lastPlatform.x + 42, this.lastPlatform.y + 7);
            this.backgroundContext.lineTo(this.x + 13, this.y + 22);
            this.backgroundContext.stroke();
        }
    }

    public checkBorders() {
        if (this.x + this.width > this.game.canvas.width) this.x = this.game.canvas.width - this.width;
        if (this.x < 0) this.x = 0;
    }

    public checkControls() {
        if (this.game.keys.pressed('left') || this.movingDirection < 0) {
            this.moveLeft();
        }
        else if (this.game.keys.pressed('right') || this.movingDirection > 0) {
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
        console.log(this.lastMaxAltitude);
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
}