import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  spinner?: Phaser.GameObjects.Shape;

  rotationSpeed = Phaser.Math.PI2 / 1000; // radians per millisecond
  leftRightVelocity = 0.5;
  verticalVelocity = 0.5;

  defaultSpinnerX = 350;
  defaultSpinnerY = 450;
  defaultAngle = 0;
  fired = false;

  //Enemy Traits
  enemies:Phaser.GameObjects.Rectangle[]  = [];
  enemyVelocity = 0.25;
  constructor() {
    super("play");
  }

  preload() {
    this.load.image("starfield", starfieldUrl);
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");

    this.starfield = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width as number,
        this.game.config.height as number,
        "starfield",
      )
      .setOrigin(0, 0);
      this.spinner = this.add.rectangle(this.defaultSpinnerX, this.defaultSpinnerY, 10, 10, 0xfc46aa);
      this.spawnEnemy();
  
    }
  
    resetSpinner() {
      this.spinner!.x = this.defaultSpinnerX;
      this.spinner!.y = this.defaultSpinnerY;
      this.fired = false;
      this.spinner!.rotation = this.defaultAngle;
    }
  
    spawnEnemy() {
      this.enemies.push(this.add.rectangle(900, Math.random() * 400, 50, 50, 0xFF0000));
      setTimeout(()=>{this.spawnEnemy()}, Math.random()* 2000 + 500)
    this.spinner = this.add.rectangle(100, 100, 50, 50, 0x53faa2);
  }

  update(_timeMs: number, delta: number) {
    this.starfield!.tilePositionX -= 4;

    if (this.left!.isDown) {
      this.spinner!.rotation -= delta * this.rotationSpeed;
      this.spinner!.x -= delta * this.leftRightVelocity;
    }
    if (this.right!.isDown) {
      this.spinner!.rotation += delta * this.rotationSpeed;
      this.spinner!.x += delta * this.leftRightVelocity;
    }

    if (this.fire!.isDown) {
      this.tweens.add({
        targets: this.spinner,
        scale: { from: 1.5, to: 1 },
        duration: 300,
        ease: Phaser.Math.Easing.Sine.Out,
      });
      this.fired = true;
    }
    if (this.fired) {
      this.spinner!.y -= delta * this.verticalVelocity;
    }
    if (this.spinner!.y < -10) {
      this.resetSpinner();
    }
    this.enemies.forEach((enemy) => {
      enemy.x -= delta * this.enemyVelocity;
    })
  }
}
