class Play extends Phaser.Scene {
  constructor() {
    super ("playScene");
  }

  preload() {
    // preload is used for loading assets
    this.load.spritesheet('rocketNew', './assets/rocketNew.png', {frameWidth: 8, frameHeight: 16, startFrame: 0, endFrame: 1}); 
    this.load.spritesheet('spaceship1', './assets/spaceship-1.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1}); 
    this.load.spritesheet('spaceship2', './assets/spaceship-2.png', {frameWidth: 48, frameHeight: 32, startFrame: 0, endFrame: 1}); 
    this.load.spritesheet('spaceship3', './assets/spaceship-3.png', {frameWidth: 48, frameHeight: 48, startFrame: 0, endFrame: 1}); 
    this.load.image('galaxy', './assets/galaxy.png');
    this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9}); 
  }

  create() {
    // place BG sprite
    this.galaxy = this.add.tileSprite(0,0,640, 480, 'galaxy').setOrigin(0,0);

    // Initialize score
    this.p1Score = 0;
    // Display score
    let scoreConfig = {
      fontFamily: 'VT323',
      fontSize: '28px',
      color: '#FFFFFF',
      align: 'left',
    }
    this.scoreLeft = this.add.text(borderPadding*2, borderPadding*2, `Score: ${this.p1Score}`, scoreConfig);

    //add rocket (player 1)
    this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding).setOrigin(0.5, 0);

    // add spaceships (x3)
    this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, "red", 100).setOrigin(0, 0);
    this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, "orange", 30).setOrigin(0,0);
    this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, "green", 10).setOrigin(0,0);

    // Define keys
    keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    
    // Game over flag
    this.gameOver = false;

    // Play timer
    this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or (F) for Menu', scoreConfig).setOrigin(0.5);
        this.gameOver = true;
    }, null, this);

    // Animations
    this.anims.create({
      key: 'explode', 
      frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
      frameRate: 30
    });

    this.anims.create({
      key: 'rocketIdle', 
      frames: this.anims.generateFrameNumbers('rocketNew', {start: 0, end: 1, first: 0}),
      frameRate: 10,
      repeat: -1
    });
    this.p1Rocket.anims.play('rocketIdle');

    this.anims.create({
      key: 'spaceship1Idle', 
      frames: this.anims.generateFrameNumbers('spaceship1', {start: 0, end: 1, first: 0}),
      frameRate: 10,
      repeat: -1
    });
    this.ship01.anims.play('spaceship1Idle');

    this.anims.create({
      key: 'spaceship2Idle', 
      frames: this.anims.generateFrameNumbers('spaceship2', {start: 0, end: 1, first: 0}),
      frameRate: 10,
      repeat: -1
    });
    this.ship02.anims.play('spaceship2Idle');

    this.anims.create({
      key: 'spaceship3Idle', 
      frames: this.anims.generateFrameNumbers('spaceship3', {start: 0, end: 1, first: 0}),
      frameRate: 10,
      repeat: -1
    });
    this.ship03.anims.play('spaceship3Idle');
  }

  update() {
    this.galaxy.tilePositionX -= 4;

    // Key Input for Restart
    if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)){
      this.scene.restart();
    }
    if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
      this.scene.start("menuScene");
    }

    if (!this.gameOver) {
      this.p1Rocket.update();

      this.ship01.update();
      this.ship02.update();
      this.ship03.update();
    }

    // check collisions
    if(this.checkCollision(this.p1Rocket, this.ship03)) {
      this.p1Rocket.reset();
      this.shipExplode(this.ship03); 
    }
    if (this.checkCollision(this.p1Rocket, this.ship02)) {
      this.p1Rocket.reset();
      this.shipExplode(this.ship02); 
    }
    if (this.checkCollision(this.p1Rocket, this.ship01)) {
      this.p1Rocket.reset();
      this.shipExplode(this.ship01); 
    }
  }

  checkCollision(rocket, ship) {
    // simple AABB checking
    if (rocket.x < ship.x + ship.width && 
      rocket.x + rocket.width > ship.x && 
      rocket.y < ship.y + ship.height &&
      rocket.height + rocket.y > ship. y) {
        return true;
    } 
    else {
      return false;
    }
  }

  shipExplode(ship) {
    // temporarily hide ship
    ship.alpha = 0;
    // create explosion sprite at ship's position
    let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
    boom.anims.play('explode');             // play explode animation
    boom.on('animationcomplete', () => {    // callback after anim completes
      ship.reset();                         // reset ship position
      ship.alpha = 1;                       // make ship visible again
      boom.destroy();                       // remove explosion sprite
    });
    // Add score
    this.p1Score += ship.points;
    this.scoreLeft.text = `Score: ${this.p1Score}`;

    this.sound.play('sfx_explosion');
  }
}