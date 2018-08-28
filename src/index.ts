import Config from './config';
import './main.css';

import { Game } from './game';
import { Device } from './device';
import { RenderingMeta } from './rendering-meta';

window.onload = () => {
  //device configuration
  let device = Device.init(window);

  //calculation of scale factor
  let scaleX = device.width / Config.GAME_WIDTH;
  let scaleY = device.height / Config.GAME_HEIGHT;
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

  //loading message
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
