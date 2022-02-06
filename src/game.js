import './main.css';
import Phaser, {Game} from 'phaser';
import BootScene from './scenes/BootScene';
import SoundFadePlugin from 'phaser3-rex-plugins/plugins/soundfade-plugin';

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
  plugins: {
    global: [
      {
        key: 'rexSoundFade',
        plugin: SoundFadePlugin,
        start: true
      }
    ]
  },
  pixelArt: true,
  scene: [
    BootScene,
    Overworld
  ]
};

const game = new Game(config);