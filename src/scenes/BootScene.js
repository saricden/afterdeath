import {Scene} from 'phaser';

class BootScene extends Scene {
  constructor() {
    super("scene-boot");
  }
  
  preload() {
    const x64 = {
      frameWidth: 64,
      frameHeight: 64
    };

    // Hero spritesheets
    this.load.spritesheet('hero-idle-down', 'assets/RPGMCharacter_v1.0/_down idle.png', x64);
    this.load.spritesheet('hero-walk-down', 'assets/RPGMCharacter_v1.0/_down walk.png', x64);
    this.load.spritesheet('hero-attack-down', 'assets/RPGMCharacter_v1.0/_down attack.png', x64);
    this.load.spritesheet('hero-idle-side', 'assets/RPGMCharacter_v1.0/_side idle.png', x64);
    this.load.spritesheet('hero-walk-side', 'assets/RPGMCharacter_v1.0/_side walk.png', x64);
    this.load.spritesheet('hero-attack-side', 'assets/RPGMCharacter_v1.0/_side attack.png', x64);
    this.load.spritesheet('hero-idle-up', 'assets/RPGMCharacter_v1.0/_up idle.png', x64);
    this.load.spritesheet('hero-walk-up', 'assets/RPGMCharacter_v1.0/_up walk.png', x64);
    this.load.spritesheet('hero-attack-up', 'assets/RPGMCharacter_v1.0/_up attack.png', x64);

    // Maps
    this.load.tilemapTiledJSON('map-overworld', 'assets/maps/overworld.json');
    this.load.image('postapo', 'assets/PALands_DEMO/DEMO-ex.png');

    // Music
    this.load.audio('music-flaremain', 'assets/audio/flaremain.mp3');
  }

  create() {
    // Create animations
    this.anims.create({
      key: 'anim-hero-idle-down',
      frames: this.anims.generateFrameNumbers('hero-idle-down', { start: 0, end: 4 }),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: 'anim-hero-walk-down',
      frames: this.anims.generateFrameNumbers('hero-walk-down', { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: 'anim-hero-attack-down',
      frames: this.anims.generateFrameNumbers('hero-attack-down', { start: 0, end: 2 }),
      frameRate: 12,
      repeat: 0
    });

    this.anims.create({
      key: 'anim-hero-idle-side',
      frames: this.anims.generateFrameNumbers('hero-idle-side', { start: 0, end: 4 }),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: 'anim-hero-walk-side',
      frames: this.anims.generateFrameNumbers('hero-walk-side', { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: 'anim-hero-attack-side',
      frames: this.anims.generateFrameNumbers('hero-attack-side', { start: 0, end: 2 }),
      frameRate: 12,
      repeat: 0
    });

    this.anims.create({
      key: 'anim-hero-idle-up',
      frames: this.anims.generateFrameNumbers('hero-idle-up', { start: 0, end: 4 }),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: 'anim-hero-walk-up',
      frames: this.anims.generateFrameNumbers('hero-walk-up', { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: 'anim-hero-attack-up',
      frames: this.anims.generateFrameNumbers('hero-attack-up', { start: 0, end: 2 }),
      frameRate: 12,
      repeat: 0
    });

    this.sound.setVolume(0);

    this.scene.start('scene-overworld');
  }
}

export default BootScene;