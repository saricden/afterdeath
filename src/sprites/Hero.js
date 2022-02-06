import { GameObjects, Math as pMath } from 'phaser';
const { Sprite } = GameObjects;

class Hero extends Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'hero-idle-down');

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.body.setSize(16, 24);
    this.body.setOffset(24.5, 26);
    // ... all hail magic numbers! </3

    this.speed = 100;
    this.tx = null;
    this.ty = null;
    this.animOverride = false;
    this.animDirection = 'down';
    this.pointerDownTime = Date.now();
    this.doubleTapThreshold = 200;

    this.scene.input.on('pointerdown', ({ worldX, worldY }) => {
      console.log(Date.now() - this.pointerDownTime);
      const isDoubleTap = (Date.now() - this.pointerDownTime < this.doubleTapThreshold);
      const isSingleTap = !isDoubleTap;

      if (!this.animOverride) {
        if (isDoubleTap) {
          this.tx = null;
          this.ty = null;
          this.body.reset(this.x, this.y);
          this.animOverride = true;
  
          this.play(`anim-hero-attack-${this.animDirection}`);
        }
        else if (isSingleTap) {
          this.tx = worldX;
          this.ty = worldY;
        }
      }

      this.pointerDownTime = Date.now();
    });

    // Animation triggers
    this.on('animationcomplete', ({ key }) => {
      if (key.startsWith('anim-hero-attack')) {
        this.animOverride = false;
      }
    });
  }

  update() {
    const dxy = pMath.Distance.Between(this.x, this.y, this.tx, this.ty);

    if (dxy > 4 && this.tx !== null && this.ty !== null) {
      this.scene.physics.moveTo(this, this.tx, this.ty, this.speed);
    }
    else if (this.tx !== null && this.ty !== null) {
      this.body.reset(this.tx, this.ty);
      this.tx = null;
      this.ty = null;
    }

    // Animation logic
    if (!this.animOverride) {
      const { x: vx, y: vy } = this.body.velocity;
      const isMoving = (vx !== 0 || vy !== 0);
      const isIdle = !isMoving;

      if (isMoving) {
        const isTrendingX = (Math.abs(vx) >= Math.abs(vy));
        const isTrendingY = !isTrendingX;
  
        if (isTrendingX) {
          const isGoingLeft = (vx < 0);
          const isGoingRight = !isGoingLeft;
  
          if (isGoingLeft) {
            this.animDirection = 'side';
            this.setFlipX(false);
          }
          else if (isGoingRight) {
            this.animDirection = 'side';
            this.setFlipX(true);
          }
        }
        else if (isTrendingY) {
          const isGoingUp = (vy < 0);
          const isGoingDown = !isGoingUp;

          if (isGoingUp) {
            this.animDirection = 'up';
          }
          else if (isGoingDown) {
            this.animDirection = 'down';
          }
        }

        this.play(`anim-hero-walk-${this.animDirection}`, true);
      }
      else if (isIdle) {
        this.play(`anim-hero-idle-${this.animDirection}`, true);
      }
    }
  }
}

export default Hero;