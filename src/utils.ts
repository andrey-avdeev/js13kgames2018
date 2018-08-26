import { Platform } from './prefabs/platform';
import { Config } from './config';
import { Player } from './prefabs/player';

export class Utils {
    public static spawnPlatform = (game: any, player: Player, isRegenerated: boolean = false): Platform => {
        let spriteSheet = game.spriteSheet({
            image: game.assets.images.platform,
            frameWidth: 50,
            frameHeight: 16,
            animations: {
                idle: {
                    frames: [0],
                    frameRate: 10,
                    loop: true
                },
                connected: {
                    frames: [1, 2, 1],
                    frameRate: 20,
                    loop: true
                },
                charged: {
                    frames: [3, 4, 3],
                    frameRate: 20,
                    loop: true
                }
            }
        });

        var platform = null;

        if (!isRegenerated) {
            let height = Math.floor(Math.random() * game.canvas.height * 2) + 0
            platform = new Platform(
                game,
                game.background.context,
                Math.floor(Math.random() * game.canvas.width) + 0,
                game.canvas.height - height,
                0,
                0,
                null,
                spriteSheet.animations,
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
            platform = new Platform(
                game,
                game.background.context,
                Math.floor(Math.random() * (game.canvas.width - Config.PLATFORM_BASE_WIDTH)) + 0,
                player.altitude - altitude + game.canvas.height / 2,
                0,
                0,
                null,
                spriteSheet.animations,
                'red',
                Config.PLATFORM_BASE_WIDTH,
                Config.PLATFORM_BASE_HEIGHT,
                Infinity,
                player,
                altitude
            )
        }
        platform.id = Utils.uuid();
        // console.log(platform as any);
        platform = game.sprite(platform);
        // console.log(platform);
        (platform as any).playAnimation('idle');

        return platform;
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

    public static uuid() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }

    public static s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
}