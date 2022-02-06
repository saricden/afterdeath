import { GameObjects, Math as pMath } from 'phaser';
const { Sprite } = GameObjects;

class Slime extends Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'slime');

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.play('anim-slime-walk');
    this.setScale(0.25);

    this.isActive = false;

    // HP Setup
    this.maxHP = 5;
    this.hp = this.maxHP;
    this.hpbar = this.scene.add.graphics();
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  update() {
    if (this.isActive) {
      
    }
  }
}

export default Slime;