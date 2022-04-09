class Spaceship extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, type, pointValue){
    super(scene, x, y, type);
    scene.add.existing(this);
    this.points = pointValue;
    this.resetting = false;
    this.type = type;
    if (type in game.settings.spaceshipSpeed) this.moveSpeed = game.settings.spaceshipSpeed[type];
    else {
      console.error("Spaceship type is invalid. Reverting to default values.");
      this.moveSpeed = 3;
    }
  }

  update() {
    // Move spaceships left
    if(!this.resetting){
      this.x -= this.moveSpeed;
      // Wrap the screen
      if(this.x <= 0 - this.width){
        this.x = game.config.width;
      }
    }
  }
  
  reset() {
    this.x = game.config.width;
    this.resetting = true;
  }
}