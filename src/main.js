let config = {
  type: Phaser.CANVAS,
  width: 640,
  height: 480,
  pixelArt: true,
  zoom: 2,
  scene: [Menu, Play]
}

let game = new Phaser.Game(config);

// Reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

// UI sizes
let borderUISize = game.config.width / 15;
let borderPadding = borderUISize / 3;