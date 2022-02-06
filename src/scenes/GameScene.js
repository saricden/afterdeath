import {Scene} from 'phaser';
import Hero from '../sprites/Hero';

class GameScene extends Scene {
  constructor() {
    super("scene-game");
  }

  create() {
    // Add, scale, and make up a speed for our creature
    this.hero = new Hero(this, 300, 300);
    // Create a helper object for our arrow keys

    this.cameras.main.setZoom(2);
    // this.cameras.main.startFollow(this.hero);
  }

  update() {
    this.hero.update();
  }

}
export default GameScene;