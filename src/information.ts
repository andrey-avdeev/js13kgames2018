import { Game } from "./game";
import { Config } from "./config";

export class Information {

    constructor(public game: Game) {
        this.highScore = game.engine.store.get('highScore');
        if (!this.highScore) this.highScore = 0;
    }

    public altitude: number = 0;
    public jumps: number = 0;
    public connectedPlatforms: number = 0;

    public lives: number = 0;
    public liveWasLost: boolean = false;
    public liveWasGained: boolean = false;

    public killedEnemies: number = 0;
    public score: number = 0;
    public highScore: number;


    public update() {
        this.altitude = Math.round(this.game.player.lastMaxAltitude);
        this.jumps = this.game.player.jumps;
        this.connectedPlatforms = this.game.player.connectedPlatforms ? this.game.player.connectedPlatforms : 0;

        if (this.lives > this.game.player.lives) {
            this.liveWasLost = true;
            setTimeout(() => {
                this.liveWasLost = false;
            }, 800);
        }
        if (this.lives < this.game.player.lives) {
            this.liveWasGained = true;
            setTimeout(() => {
                this.liveWasGained = false;
            }, 800);
        }
        this.lives = this.game.player.lives;

        this.killedEnemies = this.game.player.killedEnemies ? this.game.player.killedEnemies : 0;
        this.score = this.killedEnemies + this.connectedPlatforms;
        if (this.score >= Config.GAME_EXTRA_LIVE_FACTOR && this.score % Config.GAME_EXTRA_LIVE_FACTOR == 0) {
            this.game.player.connectedPlatforms++;
            this.game.player.lives += 1;
        }

        if (this.highScore < this.score) {
            this.highScore = this.score;
            this.game.engine.store.set('highScore', this.highScore);
        }
    }

    public render() {
        this.game.ui.context.font = "10px Arial";
        this.game.ui.context.fillStyle = "white";
        this.game.ui.context.textAlign = "center";

        if(this.liveWasGained){
            this.game.ui.context.font = "16px Arial";
            this.game.ui.context.fillStyle = "green";
        }
        if(this.liveWasLost){
            this.game.ui.context.font = "16px Arial";
            this.game.ui.context.fillStyle = "red";
        }

        this.game.ui.context.fillText("lives: " + this.lives, Config.GAME_WIDTH / 2 - Config.GAME_WIDTH / 3, 20);

        this.game.ui.context.font = "10px Arial";
        this.game.ui.context.fillStyle = "white";
        let alt = this.altitude < 1000 ? this.altitude : Math.round(this.altitude / 1000) + 'k';
        this.game.ui.context.fillText("alt: " + alt, Config.GAME_WIDTH / 2 - Config.GAME_WIDTH / 5, 20);
        this.game.ui.context.fillText("score: " + this.score, Config.GAME_WIDTH / 2 + Config.GAME_WIDTH / 8, 20);
        this.game.ui.context.fillText("high score: " + this.highScore, Config.GAME_WIDTH / 2 + Config.GAME_WIDTH / 3, 20);
    }
}