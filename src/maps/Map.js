import { Scene } from 'phaser';
import Hero from '../sprites/Hero';

class Map extends Scene {
  constructor(key, { tilemapKey, tilesetKey, tilesetName, musicKey = null }) {
    super(key);

    this.tilemapKey = tilemapKey;
    this.tilesetKey = tilesetKey;
    this.tilesetName = tilesetName;
    this.musicKey = musicKey;
  }

  create() {
    // Add hero
    this.hero = new Hero(this, 0, 0);
    
    // Add map
    this.map = this.add.tilemap(this.tilemapKey);
    const tiles = this.map.addTilesetImage(this.tilesetName, this.tilesetKey, 16, 16, 1, 2);
    this.mapGround = this.map.createLayer('ground', tiles);
    this.mapFloors = this.map.createLayer('floors', tiles);
    this.mapBG2 = this.map.createLayer('bg2', tiles);
    this.mapBG1 = this.map.createLayer('bg1', tiles);
    this.mapFG2 = this.map.createLayer('fg2', tiles);
    this.mapFG1 = this.map.createLayer('fg1', tiles);
    this.mapRoofs = this.map.createLayer('roofs', tiles);

    // Spawn sprites
    this.map.getObjectLayer('sprites').objects.forEach(({name, x, y}, i) => {
      if (name === 'hero') {
        this.hero.setPosition(x, y);
      }
    });

    // Collsions
    this.mapBG2.setCollisionByProperty({ collides: true });
    this.mapBG1.setCollisionByProperty({ collides: true });
    this.mapFG2.setCollisionByProperty({ collides: true });
    this.mapFG1.setCollisionByProperty({ collides: true });
    
    this.physics.add.collider(this.hero, this.mapBG2);
    this.physics.add.collider(this.hero, this.mapBG1);
    this.physics.add.collider(this.hero, this.mapFG2);
    this.physics.add.collider(this.hero, this.mapFG1);

    // Camera config
    this.cameras.main.setZoom(2);
    this.cameras.main.startFollow(this.hero);

    // Music
    if (this.musicKey !== null) {
      this.bgm = this.sound.add(this.musicKey, { loop: true });
      this.bgm.play();
    }
  }

  hideRoofs() {
    if (this.mapRoofs.alpha === 1) {
      this.tweens.add({
        targets: this.mapRoofs,
        alpha: 0.25,
        duration: 500
      });
    }
  }

  showRoofs() {
    if (this.mapRoofs.alpha === 0.25) {
      this.tweens.add({
        targets: this.mapRoofs,
        alpha: 1,
        duration: 500
      });
    }
  }

  update() {
    this.hero.update();

    // Hiding the roof
    const roofTile = this.mapRoofs.getTileAtWorldXY(this.hero.x, this.hero.y);

    if (roofTile !== null) {
      this.hideRoofs();
    }
    else {
      this.showRoofs();
    }

    // Layering
    this.mapRoofs.setDepth(this.map.heightInPixels + 3);
    this.mapFG1.setDepth(this.map.heightInPixels + 2);
    this.mapFG2.setDepth(this.map.heightInPixels + 1);
    this.hero.setDepth(this.hero.y);
    this.mapBG1.setDepth(-1);
    this.mapBG2.setDepth(-2);
    this.mapFloors.setDepth(-3);
    this.mapGround.setDepth(-4);
  }
}

export default Map;