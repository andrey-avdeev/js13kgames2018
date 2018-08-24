import Config from './config';
import './main.css';
import { Platform } from './prefabs/platform'
import { Player } from './prefabs/player';

window.onload = () => {
  var kontra = (window as any).kontra;
  kontra.init();

  let quadtree = kontra.quadtree();

  //generate objects
  let player = kontra.sprite(new Player(kontra, kontra.canvas.width / 2 - 10, kontra.canvas.height / 2 - 10, 0, +1, null, 'black', 20, 20, kontra.canvas.height / 2)) as Player;

  kontra.pointer.onDown(function (event, object) {
    if (event.touches) {
      let touch = event.touches[0];
      event.x = touch.pageX;;
      event.y = touch.pageY;
    }

    if (event.x > kontra.canvas.width / 2) {
      player.movingDirection = 1;
    } else if (event.x < kontra.canvas.width / 2) {
      player.movingDirection = -1;
    }
  });

  kontra.pointer.onUp(function (event, object) {
    player.movingDirection = 0;
  });

  let platforms = kontra.pool({
    create: kontra.sprite,
    maxSize: 100,
  });

  for (var i = 1; i <= platforms.maxSize; i++) {
    let height = Math.floor(Math.random() * kontra.canvas.height * 2) + 0
    platforms.get(
      new Platform(kontra,
        Math.floor(Math.random() * kontra.canvas.width) + 0,
        kontra.canvas.height - height,
        0,
        0,
        null,
        'red',
        30,
        10,
        Infinity,
        player,
        height
      )
    );
  }

  var loop = kontra.gameLoop({
    update: function () {
      (player as any).update();
      platforms.update();

      quadtree.clear();
      quadtree.add(platforms.getAliveObjects());
      // console.log('platfroms size:', platforms.getAliveObjects().length);

      let objects = quadtree.get(player);

      let playerMustJump = false;

      let wasCollision = false;
      var i = -1;
      while (!wasCollision && ++i < objects.length) {
        let obj = objects[i];
        if (obj.type === 'platform' && obj.collidesWith(player)) {
          playerMustJump = true;
          obj.dy = 20;
          obj.underTension = true;
          player.preLastPlatform = player.lastPlatform;
          player.lastPlatform = obj;
        }
      }

      if (playerMustJump) player.jump();

      //generate new platforms
      for (var i = 0; i <= platforms.maxSize - platforms.getAliveObjects().length; i++) {
        let height = Math.floor(Math.random() * kontra.canvas.height * 2 * 2) + 0;
        let altitude = player.altitude + kontra.canvas.height / 2 + height;
        platforms.get(
          new Platform(kontra,
            Math.floor(Math.random() * kontra.canvas.width) + 0,
            player.altitude - altitude + kontra.canvas.height / 2,
            0,
            0,
            null,
            'red',
            30,
            10,
            Infinity,
            player,
            altitude
          )
        );
      }
    },
    render: function () {
      (player as any).render();
      platforms.render();
    }
  });

  loop.start();    // start the game
};
