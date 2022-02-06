import './main.css';
import Phaser, {Game} from 'phaser';
import BootScene from './scenes/BootScene';

// Maps
import Overworld from './maps/Overworld';

const config = {
  type: Phaser.WEB_GL,
  parent: 'game',
  scale: {
      mode: Phaser.Scale.NONE,
      parent: 'game',
      width: window.innerWidth,
      height: window.innerHeight
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  pixelArt: true,
  scene: [
    BootScene,
    Overworld
  ]
};

const game = new Game(config);