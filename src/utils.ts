import { Platform } from './prefabs/platform';
import { Config } from './config';
import { Player } from './prefabs/player';

export class Utils {
    public static spawnPlatform = (game: any, player: Player, isRegenerated: boolean = false): Platform => {
        let height = 0;
        let y = 0;
        if (!isRegenerated) {
            height = Math.floor(Math.random() * game.canvas.height * 2) + 0;
            // new Platform(kontra,
            //     kontra.background.context,
            //     Math.floor(Math.random() * kontra.canvas.width) + 0,
            //     kontra.canvas.height - height,
            //     0,
            //     0,
            //     null,
            //     'red',
            //     30,
            //     10,
            //     Infinity,
            //     player,
            //     height
            //   )


        } else {
            height = Math.floor(Math.random() * game.canvas.height * 2 ) + 0;
        }

        let altitude = player.altitude + game.canvas.height / 2 + height;

        return new Platform(game,
            game.background.context,
            Math.floor(Math.random() * (game.canvas.width - Config.PLATFORM_BASE_WIDTH)) + 0,
            // player.altitude - altitude + game.canvas.height / 2,
            isRegenerated ? player.altitude - altitude + game.canvas.height / 2 : game.canvas.height - height,
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