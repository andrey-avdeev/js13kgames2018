import { Sprite } from "./sprite";
import { Game } from "../game";
import Config from "../config";

export class Enemy extends Sprite {

    constructor(
        game: Game,
        x: number,
        y: number,
        dx: number,
        dy: number,
        ttl: number,
        public altitude: number
    ) {
        super(game, x, y, dx, dy, game.engine.assets.images.enemy, 'red', Config.ENEMY_BASE_WIDTH, Config.ENEMY_BASE_WIDTH, "enemy", ttl);
    }

    public onScreen: boolean = true;

    public destroy() {
        this.ttl = 0;
    }

    public explode() {
        this.destroy();
    }

    public update(dt) {
        if ((this as any)._ca) (this as any)._ca.update(dt);
        if (!this.outOfBorders()) {
            this.y = this.game.player.altitude - this.altitude + Config.GAME_HEIGHT / 2;

            if (this.dx != 0 || this.dy != 0) {
                this.x += this.dx;
                this.altitude -= this.dy;
            }
        }
    }

    public outOfBorders() {
        if (this.altitude + Config.GAME_HEIGHT * Config.ENEMY_LIVE_GAP <= this.game.player.altitude) {
            this.onScreen = false;
            this.destroy();
            return true;
        } else {
            return false;
        }
    }

    public render() {
        (this as any).draw();
    }
}