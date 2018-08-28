import Config from './config';
import { Platform } from './prefabs/platform'
import { Player } from './prefabs/player';
import { Utils } from './utils';
import { RenderingMeta } from './rendering-meta';
import { Information } from './information';
import { Enemy } from './prefabs/enemy';


export class Game {
    constructor(public canvases: any) {
        this.engine = (window as any).kontra;

        this.background = canvases['background'];
        this.foreground = canvases['foreground'];
        this.ui = canvases['ui'];

        this.cPlayer = new (window as any).CPlayer();
        this.song = (window as any).song;
    }

    public engine: any;

    public background: RenderingMeta;
    public foreground: RenderingMeta;
    public ui: RenderingMeta;

    public cPlayer: any;
    public song: any;
    public audio: HTMLAudioElement;

    public soundsWereInitialized: boolean = false;
    public imagesWereInitialized: boolean = false;

    public player: Player = null;
    public platforms: any = null;
    public enemies: any = null;

    public enemyGenerationTimeout: number = Config.ENEMY_MAX_GENERATION_TIMEOUT;

    public platfromsQuadtree: any = null;
    public enemiesQuadtree: any = null;

    public information: Information = null;

    public loop: any = null;

    public isExplosionPulseState: boolean = false;
    public isRunning: boolean = false;

    public prepare() {
        this.soundPrepare();
        this.enginePrepare();
    }

    public soundPrepare() {
        this.cPlayer.init(this.song);
        var cplayer = this.cPlayer;
        var game = this;

        setInterval(function () {
            if (game.soundsWereInitialized) return;

            game.soundsWereInitialized = cplayer.generate() >= 1;

            if (game.soundsWereInitialized) {
                var wave = cplayer.createWave();
                game.audio = document.createElement("audio");
                game.audio.src = URL.createObjectURL(new Blob([wave], { type: "audio/wav" }));
                game.audio.loop = true;
            }
        }, 0);
    }

    public enginePrepare() {
        var game = this;
        this.engine.init(game.foreground.canvas);
        this.engine.assets.imagePath = 'assets/images/';
        this.engine.assets.load(
            'player.png', 'platform.png', 'enemy.png'
        ).then(() => game.imagesWereInitialized = true);
    }

    public init() {
        let game = this;
        this.isRunning = true;
        this.enemyGenerationTimeout = Config.ENEMY_MAX_GENERATION_TIMEOUT;
        this.isExplosionPulseState = false;
        this.player = this.engine.sprite(
            new Player(
                this,
                Config.GAME_WIDTH / 2 - 10,
                Config.GAME_HEIGHT / 2 - 10,
                0,
                +1,
                Config.GAME_HEIGHT / 2
            )) as Player;

        Utils.initTouchControl(game);

        this.platforms = this.engine.pool({
            create: this.engine.sprite,
            maxSize: Config.PLATFORM_POOL_MAX_SIZE,
        });

        //initial platform generation
        let floorCount = Math.round(Config.GAME_WIDTH / Config.PLATFORM_BASE_WIDTH);
        //ground platforms
        for (var i = 0; i <= floorCount; i++) {
            let platform = new Platform(
                this,
                i * Config.PLATFORM_BASE_WIDTH,
                Config.GAME_HEIGHT - Config.PLATFORM_BASE_HEIGHT,
                0,
                0,
                Infinity,
                0
            );
            platform.isUnmovable = true;
            platform.id = Utils.uuid();
            platform = game.engine.sprite(platform);
            platform.animation = 'idle';
            this.platforms.get(platform)
        }

        // air platforms
        for (var i = 1; i <= this.platforms.maxSize - floorCount; i++)
            this.platforms.get(Utils.spawnPlatform(game));

        this.enemies = this.engine.pool({
            create: this.engine.sprite,
            maxSize: Config.ENEMY_POOL_MAX_SIZE,
        });

        //enemy generation
        this.spawnEnemies(game);

        this.platfromsQuadtree = this.engine.quadtree();
        this.enemiesQuadtree = this.engine.quadtree();

        this.information = new Information(this);
    }

    public spawnEnemies(game: Game) {
        if (game.isRunning) {
            game.enemies.get(Utils.spawnEnemy(game));
            if (game.enemyGenerationTimeout > Config.ENEMY_MIN_GENERATION_TIMEOUT)
                game.enemyGenerationTimeout -= 1;
            setTimeout(() => game.spawnEnemies(game), game.enemyGenerationTimeout)
        }
    }

    public gameOver() {
        this.stop();
        let game = this;

        document.getElementById('content').style.display = 'none';
        document.getElementById('gameover').style.display = 'block';

        let removeHandlers = () => {
            document.onkeydown = null;
            document.ontouchstart = null;
        }

        setTimeout(() => {
            document.onkeydown = (e) => {
                removeHandlers();

                let event = e || window.event as KeyboardEvent;

                if (event.keyCode == 37 || event.keyCode == 39)
                    game.restart();
            };

            document.ontouchstart = (e) => {
                removeHandlers();
                game.restart();
            }
        }, 1000);
    }

    public restart() {
        this.init();
        document.getElementById('gameover').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        this.start();
    }

    public start() {
        this.audio.play();

        let game = this;
        this.loop = this.engine.gameLoop({
            update: function () {
                (game.player as any).update();
                game.platforms.update();
                game.enemies.update();

                //check platfroms collisions
                game.platfromsQuadtree.clear();
                game.platfromsQuadtree.add(game.platforms.getAliveObjects());
                let objects = game.platfromsQuadtree.get(game.player);

                let wasCollision = false;
                var i = -1;
                while (!wasCollision && ++i < objects.length) {
                    let obj = objects[i];
                    if (obj.type === 'platform' && obj.collidesWith(game.player)) {
                        game.player.jumpOffPlatform(obj);
                        wasCollision = true;
                    }

                }

                //check enemies collisions with player
                game.enemiesQuadtree.clear();
                game.enemiesQuadtree.add(game.enemies.getAliveObjects());
                let enemyObjects = game.enemiesQuadtree.get(game.player);

                let wasEnemyCollision = false;
                var i = -1;
                while (!wasEnemyCollision && ++i < enemyObjects.length) {
                    let obj = enemyObjects[i];
                    if (obj.type === 'enemy' && obj.collidesWith(game.player)) {
                        game.player.killEnemy(obj);
                        wasEnemyCollision = true;
                    }
                }

                //check enemies collisions with platfroms
                enemyObjects.forEach(enemy => {
                    let objects = game.platfromsQuadtree.get(enemy);

                    let wasCollision = false;
                    var i = -1;
                    while (!wasCollision && ++i < objects.length) {
                        let obj = objects[i] as Platform;
                        if (obj.type === 'platform'
                            && obj.underTension
                            && (obj as any).collidesWith(enemy)
                            && obj.onScreen) {
                            game.player.kill();
                            (enemy as Enemy).explode();
                            obj.explosionPulse();
                            wasCollision = true;

                            if (game.player.lives <= 0) game.gameOver();
                        }
                    }
                });

                //generate new platforms
                for (var i = 0; i <= game.platforms.maxSize - game.platforms.getAliveObjects().length; i++)
                    game.platforms.get(Utils.spawnPlatform(game, true));

                game.information.update();
            },
            render: function () {
                game.background.context.save();
                game.background.context.clearRect(0, 0, Config.GAME_WIDTH, Config.GAME_HEIGHT);

                game.ui.context.save();
                game.ui.context.clearRect(0, 0, Config.GAME_WIDTH, Config.GAME_HEIGHT);

                (game.player as any).render();
                game.platforms.render();
                game.enemies.render();
                game.information.render();

                game.background.context.restore();
                game.ui.context.restore();
            }
        });

        this.loop.start();
    }

    public stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isRunning = false;
        this.loop.stop();
    }
}