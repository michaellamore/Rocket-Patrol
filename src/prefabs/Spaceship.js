class Spaceship extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, pointValue){
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    this.points = pointValue;
    this.moveSpeed = game.settings.spaceshipSpeed;
  }

  update() {
    // Move spaceships left
    this.x -= this.moveSpeed;
    // Wrap the screen
    if(this.x <= 0 - this.width){
      this.x = game.config.width;
    }
  }
  reset() {
    this.x = game.config.width;
  }
}