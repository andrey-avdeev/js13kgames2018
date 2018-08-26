import Config from './config';
import './main.css';
import { Platform } from './prefabs/platform'
import { Player } from './prefabs/player';
import { Utils } from './utils';

window.onload = () => {
  // sound initialization
  var cPlayer = new (window as any).CPlayer();
  cPlayer.init((window as any).song);

  var done = false;
  setInterval(function () {
    if (done) return;

    done = cPlayer.generate() >= 1;

    if (done) {
      var wave = cPlayer.createWave();
      var audio = document.createElement("audio");
      audio.src = URL.createObjectURL(new Blob([wave], { type: "audio/wav" }));
      audio.play();
    }
  }, 0);

  // game initialization
  var kontra = (window as any).kontra;
  kontra.init("foreground");
  kontra.background = {
    canvas: document.getElementById('background'),
    context: (document.getElementById('background') as any).getContext('2d') as CanvasRenderingContext2D
  };
  kontra.ui = {
    canvas: document.getElementById('ui'),
    context: (document.getElementById('ui') as any).getContext('2d') as CanvasRenderingContext2D
  };

  kontra.assets.imagePath = 'assets/images/';
  kontra.assets.load(
    'player.png', 'platform.png'
  ).then(function () {
    document.getElementById('loading').style.display = 'none';

    let quadtree = kontra.quadtree();

    let spriteSheet = kontra.spriteSheet({
      image: kontra.assets.images.player,
      frameWidth: 26,
      frameHeight: 26,
      animations: {
        idle: {
          frames: [0, 1],
          frameRate: 10,
          loop: true
        },
        jump: {
          // frames: [0, 1, 2, 1, 0],
          frames: [2,1,0],
          frameRate: 10,
          loop: false
        }
      }
    });

    let player = kontra.sprite(
      new Player(
        kontra,
        kontra.canvas.width / 2 - 10,
        kontra.canvas.height / 2 - 10,
        0,
        +1,
        null,
        spriteSheet.animations,
        'black',
        Config.PLAYER_BASE_WIDTH,
        Config.PLAYER_BASE_HEIGHT,
        kontra.canvas.height / 2
      )) as Player;
    player.backgroundContext = kontra.background.context;
    (player as any).playAnimation('idle');

    Utils.initTouchControl(kontra, player);

    let platforms = kontra.pool({
      create: kontra.sprite,
      maxSize: Config.PLATFORM_POOL_MAX_SIZE,
    });

    for (var i = 1; i <= platforms.maxSize; i++)
      platforms.get(Utils.spawnPlatform(kontra, player));


    var loop = kontra.gameLoop({
      update: function () {
        (player as any).update();
        // (player.animations as any).jump.update();
        platforms.update();

        quadtree.clear();
        quadtree.add(platforms.getAliveObjects());
        let objects = quadtree.get(player);

        let wasCollision = false;
        var i = -1;
        while (!wasCollision && ++i < objects.length) {
          let obj = objects[i];
          if (obj.type === 'platform' && obj.collidesWith(player)) {
            player.jump();
            obj.dy = Config.PLATFORM_AFTERJUMP_SPEED;
            (obj as any).playAnimation('connected');
            obj.underTension = true;
            obj.isConnectedWithPlayer = true;
            player.preLastPlatform = player.lastPlatform;
            player.lastPlatform = obj;
            player.lastPlatform.wasRegenerated = false;

            if (player.preLastPlatform) {
              // console.log('has prelast');
              player.preLastPlatform.isConnectedWithPlayer = false;
              player.preLastPlatform.wasRegenerated = false;
              if (player.preLastPlatform.id != player.lastPlatform.id)
                (player.preLastPlatform as any).playAnimation('charged');
            }
            player.lastPlatform.inConnection = player.preLastPlatform;
            if (player.preLastPlatform) player.preLastPlatform.outConnection = player.lastPlatform;
          }
        }

        //generate new platforms
        for (var i = 0; i <= platforms.maxSize - platforms.getAliveObjects().length; i++)
          platforms.get(Utils.spawnPlatform(kontra, player, true));

      },
      render: function () {
        kontra.background.context.save();
        kontra.background.context.clearRect(0, 0, kontra.canvas.width, kontra.canvas.height);

        (player as any).render();
        // (player.animations as any).jump.render();
        platforms.render();

        kontra.background.context.restore()
      }
    });

    loop.start();    // start the game
  });
};
