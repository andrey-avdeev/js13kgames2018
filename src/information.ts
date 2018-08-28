import { Game } from "./game";
import { Config } from "./config";

export class Information {

    constructor(public game: Game) {
    }

    public altitude: number = 0;
    public jumps: number = 0;
    public connectedPlatforms: number = 0;
    public lives: number = 0;
    public killedEnemies: number = 0;

    public update() {
        this.altitude = Math.round(this.game.player.lastMaxAltitude);
        this.jumps = this.game.player.jumps;
        this.connectedPlatforms = this.game.player.connectedPlatforms;
        this.lives = this.game.player.lives;
        this.killedEnemies = this.game.player.killedEnemies;
    }

    public render() {
        this.game.ui.context.font = "10px Arial";
        this.game.ui.context.fillStyle = "white";
        this.game.ui.context.textAlign = "center";
        this.game.ui.context.fillText("lives: " + this.lives, Config.GAME_WIDTH / 2 - Config.GAME_WIDTH / 4, 20);
        let alt = this.altitude < 1000 ? this.altitude : Math.round(this.altitude / 1000) + 'k';
        this.game.ui.context.fillText("alt: " + alt, Config.GAME_WIDTH / 2, 20);
        this.game.ui.context.fillText("score: " + this.connectedPlatforms, Config.GAME_WIDTH / 2 + Config.GAME_WIDTH / 4, 20);
    }
}