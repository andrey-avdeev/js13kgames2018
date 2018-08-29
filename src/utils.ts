import { Platform } from './prefabs/platform';
import { Config } from './config';
import { Game } from './game';
import { Enemy } from './prefabs/enemy';

export class Utils {
    public static spawnPlatform = (game: Game, isRegenerated: boolean = false): Platform => {
        let height = Math.floor(Math.random() * Config.GAME_HEIGHT * 2) + 0;
        let altitude = null;
        let x = Math.floor(Math.random() * (Config.GAME_WIDTH - Config.PLATFORM_BASE_WIDTH)) + 0;
        let y = null;

        if (!isRegenerated) {
            altitude = height;
            y = Config.GAME_HEIGHT - height;
        } else {
            altitude = game.player.altitude + Config.GAME_HEIGHT / 2 + height;
            y = game.player.altitude - altitude + Config.GAME_HEIGHT / 2;
        }

        let platform = new Platform(
            game,
            x,
            y,
            0,
            0,
            Infinity,
            altitude
        );
        platform.id = Utils.uuid();
        platform = game.engine.sprite(platform);
        platform.animation = 'idle';
        // (platform as any).playAnimation('idle');

        return platform;
    }

    public static spawnEnemy = (game: Game): Enemy => {
        let height = Math.floor(Math.random() * Config.GAME_HEIGHT) + 0;
        let altitude = game.player.altitude + Config.GAME_HEIGHT / 2 + height;
        let x = Math.floor(Math.random() * (Config.GAME_WIDTH - Config.ENEMY_BASE_WIDTH)) + 0;
        let y = game.player.altitude - altitude + Config.GAME_HEIGHT / 2;
        let dx = 0;
        let dy = Math.floor(Math.random() * Config.ENEMY_SPEED * 2) + 1;

        let enemy = new Enemy(
            game,
            x,
            y,
            dx,
            dy,
            Infinity,
            altitude
        );

        enemy = game.engine.sprite(enemy);

        // (enemy as any).playAnimation('idle');
        return enemy;
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