import { Platform } from './prefabs/platform';
import { Config } from './config';
import { Game } from './game';

export class Utils {
    public static spawnPlatform = (game: Game, isRegenerated: boolean = false): Platform => {
        var platform = null;

        if (!isRegenerated) {
            let height = Math.floor(Math.random() * Config.GAME_HEIGHT * 2) + 0
            platform = new Platform(
                game,
                Math.floor(Math.random() * (Config.GAME_WIDTH - Config.PLATFORM_BASE_WIDTH)) + 0,
                Config.GAME_HEIGHT - height,
                0,
                0,
                Infinity,
                height
            )
        } else {
            let height = Math.floor(Math.random() * Config.GAME_HEIGHT * 2) + 0;
            let altitude = game.player.altitude + Config.GAME_HEIGHT / 2 + height;
            platform = new Platform(
                game,
                Math.floor(Math.random() * (Config.GAME_WIDTH - Config.PLATFORM_BASE_WIDTH)) + 0,
                game.player.altitude - altitude + Config.GAME_HEIGHT / 2,
                0,
                0,
                Infinity,
                altitude
            )
        }
        platform.id = Utils.uuid();
        platform = game.engine.sprite(platform);
        (platform as any).playAnimation('idle');

        return platform;
    }

    public static initTouchControl = (game: Game): void => {
        game.engine.pointer.onDown(function (event, object) {
            if (event.touches) {
                let touch = event.touches[0];
                event.x = touch.clientX;
                event.y = touch.clientY;
                console.log(touch);
            }

            if (event.x > Config.GAME_WIDTH / 2) {
                game.player.movingDirection = 1;
            } else if (event.x < Config.GAME_WIDTH / 2) {
                game.player.movingDirection = -1;
            }
        });

        game.engine.pointer.onUp((event, object) => game.player.movingDirection = 0);
    }

    public static uuid() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }

    public static s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
}