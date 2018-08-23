import { Sprite } from './sprite';

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
        height: number
    ) {
        super(game, x, y, dx, dy, image, color, width, height,"player");
    }

    public force: number;
    public movingDirection: number = 0;

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

        if (this.y + this.height >= this.game.canvas.height) this.jump();

        this.x += this.dx;
        this.y += this.dy;

        this.applyGravity();
    }

    /**
     * moveLeft
     */
    public moveLeft() {
        this.x -= 10;
    }

    /**
     * moveRight
     */
    public moveRight() {
        this.x += 10;
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
}