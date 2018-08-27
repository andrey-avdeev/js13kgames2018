import Config from './config';
import './main.css';

import { Game } from './game';
import { Device } from './device';
import { RenderingMeta } from './rendering-meta';

window.onload = () => {
  //device configuration
  let device = Device.init(window);
  Config.GAME_WIDTH = Math.round(Config.GAME_HEIGHT * device.scaleFactor - 1);
  if (Config.GAME_WIDTH > Config.GAME_MAX_WIDTH) {
    Config.GAME_WIDTH = Config.GAME_MAX_WIDTH
  }

  let scaleX = device.width / Config.GAME_WIDTH;
  let scaleY = device.height / Config.GAME_HEIGHT;

  //canvases scaling
  let canvasNames = ['background', 'foreground', 'ui'];
  let canvases = new Array<RenderingMeta>();
  canvasNames.forEach(name => {
    let canvas = document.getElementById(name) as HTMLCanvasElement;
    canvas.width = Config.GAME_WIDTH;
    canvas.height = Config.GAME_HEIGHT;
    canvas.style.width = Config.GAME_WIDTH * scaleX + 'px';
    canvas.style.height = Config.GAME_HEIGHT * scaleY + 'px';
    canvases[name] = new RenderingMeta(canvas, canvas.getContext("2d"))
  });

  //game initialization and start
  var game = new Game(canvases);
  (window as any).game = game;

  game.prepare();

  let initAndStart = () => {
    if (game.soundsWereInitialized && game.imagesWereInitialized) {
      document.getElementById('loading').style.display = 'none';

      game.init();
      game.start();
    } else {
      setTimeout(initAndStart, 100);
    }
  }

  setTimeout(initAndStart, 100);
};
