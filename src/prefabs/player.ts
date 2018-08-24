import { Sprite } from './sprite';
import { Platform } from './platform';

export class Player extends Sprite {

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
        public altitude: number
    ) {
        super(game, x, y, dx, dy, image, color, width, height, "player");
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

    /**
     * update
     */
    public update() {
        if (this.x + this.width > this.game.canvas.width) {
            this.x = this.game.canvas.width - this.width;
        }
        if (this.x < 0) {
            this.x = 0;
        }

        if (this.game.keys.pressed('left') || this.movingDirection < 0) {
            this.moveLeft();
        }
        else if (this.game.keys.pressed('right') || this.movingDirection > 0) {
            this.moveRight();
        }

        if (this.game.keys.pressed('space')) {
            this.jump();
        }

        if (this.altitude <= 0) this.jump();

        this.x += this.dx;
        this.altitude -= this.dy;

        this.applyGravity();

        this.calculateAltitudes();
    }

    /**
     * render
     */
    public render() {
        (this as any).draw();
        //         ctx.beginPath();
        // ctx.moveTo(0,0);
        // ctx.lineTo(300,150);
        // ctx.stroke();
        // if (this.lastPlatform && this.preLastPlatform) {
        //     this.context.save();

        //     this.context.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);

        //     this.context.strokeStyle = 'blue';
        //     this.context.lineWidth = 2;

        //     this.context.beginPath;
        //     this.context.moveTo(this.lastPlatform.x, this.lastPlatform.y);
        //     this.context.lineTo(this.x, this.y);
        //     this.context.stroke();

        //     this.context.restore();
        // }
    }

    /**
     * moveLeft
     */
    public moveLeft() {
        this.x -= 5;
    }

    /**
     * moveRight
     */
    public moveRight() {
        this.x += 5;
    }

    /**
     * jump
     */
    public jump() {
        this.dy = -16;
    }

    /**
     * applyForce
     */
    public applyGravity() {
        this.dy += 0.5;
    }

    /**
     * calculateAltitudes
     */
    public calculateAltitudes() {
        this.lastMaxAltitude = (this.altitude > this.lastMaxAltitude) ? this.altitude : this.lastMaxAltitude;
        this.previousMaxAltitude = this.lastMaxAltitude;
    }
}