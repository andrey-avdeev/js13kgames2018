import Config from './config';
import './main.css';
import { Platform } from './prefabs/platform'
import { Player } from './prefabs/player';

window.onload = () => {
  var kontra = (window as any).kontra;
  kontra.init();

  let quadtree = kontra.quadtree();

  //generate objects
  let player = kontra.sprite(new Player(kontra, kontra.canvas.width / 2 - 10, kontra.canvas.height / 2 - 10, 0, -1, null, 'black', 20, 20)) as Player;

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
    maxSize: 20,
  });

  for (var i = 1; i <= platforms.maxSize; i++) {
    platforms.get(
      new Platform(kontra,
        Math.floor(Math.random() * kontra.canvas.width) + 0,
        Math.floor(Math.random() * kontra.canvas.height) + 0,
        0,
        0,
        null,
        'red',
        30,
        10,
        Infinity)
    );
  }

  var loop = kontra.gameLoop({
    update: function () {
      (player as any).update();
      platforms.update();

      quadtree.clear();
      quadtree.add(platforms.getAliveObjects());

      let objects = quadtree.get(player);

      let playerMustJump = false;

      for (var i = 0, obj; obj = objects[i]; i++) {
        if (obj.type === 'platform' && obj.collidesWith(player)) {
          playerMustJump = true;
          obj.dy=10;
          obj.underTension = true;
        }
      }

      if (playerMustJump) player.jump();

    },
    render: function () {
      (player as any).render();
      platforms.render();
    }
  });

  loop.start();    // start the game
};
