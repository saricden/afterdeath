import { Scene, Math as pMath } from 'phaser';
import Hero from '../sprites/Hero';
import Slime from '../sprites/Slime';

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

    // Handle special map points, spawns
    this.enemies = this.add.group();

    this.map.getObjectLayer('points').objects.forEach(({name, x, y}, i) => {
      if (name === 'hero') {
        this.hero.setPosition(x, y);
      }
      else if (name === 'camera-start') {
        this.cameras.main.pan(x, y, 0);
      }
      else if (name === 'slime') {
        this.enemies.add(new Slime(this, x, y));
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
    // this.cameras.main.flash(2500, 0, 0, 0);
    this.cameras.main.flash(500, 0, 0, 0);

    this.time.addEvent({
      delay: 50,
      callback: () => {
        // this.cameras.main.pan(this.hero.x, this.hero.y, 3500, 'Linear', false, (cam, prog) => {
        this.cameras.main.pan(this.hero.x, this.hero.y, 500, 'Linear', false, (cam, prog) => {
          if (prog >= 0.8) {
            this.hero.unlock();
          }
          
          if (prog === 1) {
            this.cameras.main.startFollow(this.hero);
          }
        });
      }
    });

    // Music
    this.bgm = this.sound.add(this.musicKey, { loop: true });
    this.fightBGM = this.sound.add('music-determined-pursuit', { loop: true });
    
    this.bgm.play();

    // Target UI
    this.uiTargetRed = this.add.image(0, 0, 'ui-target-red');
    this.uiTargetRed.setVisible(false);

    this.tweens.add({
      targets: this.uiTargetRed,
      angle: 360,
      repeat: -1,
      duration: 2000
    });
  }

  targetRed(object) {
    this.uiTargetRed.setPosition(object.x, object.y);
    this.uiTargetRed.setVisible(true);
  }

  clearTarget() {
    this.uiTargetRed.setVisible(false);
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

  startFight() {
    if (this.bgm.volume === 1) {
      this.plugins.get('rexSoundFade').fadeOut(this, this.bgm, 1000, false);
      this.plugins.get('rexSoundFade').fadeIn(this, this.fightBGM, 1000);
    }
  }

  endFight() {
    if (this.fightBGM.volume === 1) {
      this.plugins.get('rexSoundFade').fadeOut(this, this.fightBGM, 1000, false);
      this.plugins.get('rexSoundFade').fadeIn(this, this.bgm, 1000);
      this.hero.clearTarget();
      this.clearTarget();
    }
  }

  update() {
    this.hero.update();

    // Hiding the roof
    const roofTile = this.mapRoofs.getTileAtWorldXY(this.hero.x, this.hero.y);

    if (roofTile !== null && !this.hero.controlLock) {
      this.hideRoofs();
    }
    else {
      this.showRoofs();
    }

    // Enemy handling
    let enemyInRange = false;

    this.enemies.children.each((enemy) => {
      const d2h = pMath.Distance.Between(enemy.x, enemy.y, this.hero.x, this.hero.y);
      const inRange = (d2h < 250);

      if (inRange) {
        this.hero.target(enemy);
        enemy.activate();
        this.targetRed(enemy);
        enemyInRange = true;
      }

      enemy.update();
    });

    if (enemyInRange) {
      this.startFight();
    }
    else {
      this.endFight();
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