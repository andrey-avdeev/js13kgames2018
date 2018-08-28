import Config from './config';
import { Platform } from './prefabs/platform'
import { Player } from './prefabs/player';
import { Utils } from './utils';
import { RenderingMeta } from './rendering-meta';
import { Information } from './information';


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

    public soundsWereInitialized: boolean = false;
    public imagesWereInitialized: boolean = false;

    public player: Player = null;
    public platforms: any = null;

    public quadtree: any = null;

    public information: Information = null;

    public prepare() {
        // this.soundPrepare();
        this.soundsWereInitialized = true;
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
                var audio = document.createElement("audio");
                audio.src = URL.createObjectURL(new Blob([wave], { type: "audio/wav" }));
                audio.loop = true;
                audio.play();
            }
        }, 0);
    }

    public enginePrepare() {
        var game = this;
        this.engine.init(game.foreground.canvas);
        this.engine.assets.imagePath = 'assets/images/';
        this.engine.assets.load(
            'player.png', 'platform.png'
        ).then(() => game.imagesWereInitialized = true);
    }

    public init() {
        let game = this;
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

        //initial generation
        for (var i = 1; i <= this.platforms.maxSize; i++)
            this.platforms.get(Utils.spawnPlatform(game));

        this.quadtree = this.engine.quadtree();

        this.information = new Information(this);
    }

    public start() {
        (this.player as any).playAnimation('idle');

        let game = this;

        var loop = this.engine.gameLoop({
            update: function () {
                (game.player as any).update();
                game.platforms.update();

                //check collisions
                game.quadtree.clear();
                game.quadtree.add(game.platforms.getAliveObjects());
                let objects = game.quadtree.get(game.player);

                let wasCollision = false;
                var i = -1;
                while (!wasCollision && ++i < objects.length) {
                    let obj = objects[i];
                    if (obj.type === 'platform' && obj.collidesWith(game.player)) {
                        game.player.jumpOffPlatform(obj);
                        wasCollision = true;
                    }

                }

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
                game.information.render();

                game.background.context.restore();
                game.ui.context.restore();
            }
        });

        loop.start();
    }
}