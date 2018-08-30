import Config from './config';
import './main.css';

import { Game } from './game';
import { RenderingMeta } from './rendering-meta';

//preparing for game start
window.onload = () => {
  //calculation of scale factor
  let scaleX = window.innerWidth / Config.GAME_WIDTH;
  let scaleY = window.innerHeight / Config.GAME_HEIGHT;
  let scaleFactor = scaleX <= scaleY ? scaleX : scaleY;

  if (scaleFactor < 1) {
    Config.GAME_WIDTH *= scaleFactor;
    Config.GAME_HEIGHT *= scaleFactor;
  }

  //canvas scaling
  let canvasNames = ['background', 'foreground', 'ui'];
  let canvases = new Array<RenderingMeta>();
  canvasNames.forEach(name => {
    let canvas = document.getElementById(name) as HTMLCanvasElement;
    canvas.width = Config.GAME_WIDTH;
    canvas.height = Config.GAME_HEIGHT;
    canvas.style.width = Config.GAME_WIDTH * scaleFactor + 'px';
    canvas.style.height = Config.GAME_HEIGHT * scaleFactor + 'px';
    canvases[name] = new RenderingMeta(canvas, canvas.getContext("2d"))
  });

  //content box scaling
  let content = document.getElementById("content") as HTMLElement;
  content.style.width = Config.GAME_WIDTH * scaleFactor + 'px';
  content.style.height = Config.GAME_HEIGHT * scaleFactor + 'px';

  //game initialization and start
  var game = new Game(canvases);
  (window as any).game = game;
  game.prepare();

  //initialization delegate
  let initAndStart = () => {
    if (game.soundsWereInitialized && game.imagesWereInitialized) {
      document.getElementById('ready-screen').style.display = 'none';
      document.getElementById('content').style.display = 'block';
      game.init();
      game.start();
    } else {
      setTimeout(initAndStart, 100);
    }
  }

  //display 'about' message
  setTimeout(() => {
    document.getElementById('story').style.display = 'none';
    document.getElementById('about').style.display = 'block';

    //display ready-screen
    setTimeout(() => {
      document.getElementById('about').style.display = 'none';
      document.getElementById('ready-screen').style.display = 'block';

      let removeHandlers = () => {
        document.onkeydown = null;
        document.ontouchstart = null;
      }

      document.onkeydown = (e) => {
        removeHandlers();
        initAndStart();
      };
      document.ontouchstart = (e) => {
        removeHandlers();
        initAndStart();
      }
    }, 3000);
  }, 3000);
};
