import { Platform } from './prefabs/platform';
import { Config } from './config';
import { Player } from './prefabs/player';

export class Utils {
    public static spawnPlatform = (game: any, player: Player, isRegenerated: boolean = false): Platform => {
        if (!isRegenerated) {
            let height = Math.floor(Math.random() * game.canvas.height * 2) + 0
            return new Platform(
                game,
                game.background.context,
                Math.floor(Math.random() * game.canvas.width) + 0,
                game.canvas.height - height,
                0,
                0,
                null,
                'red',
                Config.PLATFORM_BASE_WIDTH,
                Config.PLATFORM_BASE_HEIGHT,
                Infinity,
                player,
                height
            )
        } else {
            let height = Math.floor(Math.random() * game.canvas.height * 2) + 0;
            let altitude = player.altitude + game.canvas.height / 2 + height;
            return new Platform(
                game,
                game.background.context,
                Math.floor(Math.random() * (game.canvas.width - Config.PLATFORM_BASE_WIDTH)) + 0,
                player.altitude - altitude + game.canvas.height / 2,
                0,
                0,
                null,
                'red',
                Config.PLATFORM_BASE_WIDTH,
                Config.PLATFORM_BASE_HEIGHT,
                Infinity,
                player,
                altitude
            )
        }
    }

    public static initTouchControl = (game: any, player: Player): void => {
        game.pointer.onDown(function (event, object) {
            if (event.touches) {
                let touch = event.touches[0];
                event.x = touch.pageX;;
                event.y = touch.pageY;
            }

            if (event.x > game.canvas.width / 2) {
                player.movingDirection = 1;
            } else if (event.x < game.canvas.width / 2) {
                player.movingDirection = -1;
            }
        });

        game.pointer.onUp((event, object) => player.movingDirection = 0);
    }
}