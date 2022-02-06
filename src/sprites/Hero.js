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
    this.doubleTapThreshold = 300;
    this.controlLock = true;
    this.targetObject = null;

    this.scene.input.on('pointerdown', ({ worldX, worldY }) => {
      if (!this.controlLock) {
        const isDoubleTap = (Date.now() - this.pointerDownTime < this.doubleTapThreshold);
        const isSingleTap = !isDoubleTap;
  
        if (!this.animOverride) {
          if (isDoubleTap) {
            this.tx = null;
            this.ty = null;
            this.body.reset(this.x, this.y);
            this.animOverride = true;
    
            this.play(`anim-hero-attack-${this.animDirection}`);
            
            const ri = pMath.Between(0, 2);
            this.scene.sound.play(`voice-sean-attack${ri}`);
          }
          else if (isSingleTap) {
            this.tx = worldX;
            this.ty = worldY;
          }
        }
  
        this.pointerDownTime = Date.now();
      }
    });

    // Animation triggers
    this.on('animationcomplete', ({ key }) => {
      if (key.startsWith('anim-hero-attack')) {
        this.animOverride = false;
      }
    });
  }

  unlock() {
    this.controlLock = false;
  }

  target(enemy) {
    this.targetObject = enemy;
  }

  clearTarget() {
    this.targetObject = null;
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

      if (this.targetObject === null) {
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
      else {
        const dx = (this.targetObject.x - this.x);
        const dy = (this.targetObject.y - this.y);
        const targetIsUp = (Math.abs(dy) > Math.abs(dx) && dy < 0);
        const targetIsDown = (Math.abs(dy) >= Math.abs(dx) && dy >= 0);
        const targetIsLeft = (Math.abs(dx) > Math.abs(dy) && dx < 0);
        const targetIsRight = (Math.abs(dx) >= Math.abs(dy) && dx >= 0);

        if (targetIsUp) {
          this.animDirection = 'up';
        }
        else if (targetIsDown) {
          this.animDirection = 'down';
        }
        else if (targetIsLeft) {
          this.animDirection = 'side';
          this.setFlipX(false);
        }
        else if (targetIsRight) {
          this.animDirection = 'side';
          this.setFlipX(true);
        }

        if (vx !== 0 || vy !== 0) {
          this.play(`anim-hero-walk-${this.animDirection}`, true);
        }
        else {
          this.play(`anim-hero-idle-${this.animDirection}`, true);
        }
      }
    }
  }
}

export default Hero;