import { Sprite } from './sprite';

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
        ttl: number
    ) {
        super(game, x, y, dx, dy, image, color, width, height, "platform", ttl);
    }

    public underTension: boolean = false;

    /**
     * update
     */
    public update() {
        if (this.dx != 0 || this.dy != 0) {
            this.x += this.dx;
            this.y += this.dy;

            this.applyInertia();
            this.color = 'brown';
        } else {
            if(this.underTension){
                this.color = 'blue';
            }else{
                this.color = 'red';
            }
            
        }
    }

    public applyInertia() {
        this.dx = this.dx / 2;
        this.dy = this.dy / 2;

        if (Math.round(this.dx) == 0) this.dx = 0;
        if (Math.round(this.dy) == 0) this.dy = 0;
    }
}