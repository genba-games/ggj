/* globals __DEV__ */
import Phaser from 'phaser'
import Dweller from '../actors/dweller'
<<<<<<< HEAD
=======
import Operator from '../actors/operator'
>>>>>>> 7ec9ab70ac68d4cabf3c4ae443d90a39da8e92c9
import GAMEPAD_KEY from '../gamepad/gamepad'
import config from '../config'
import { generateMaze, TILE_TYPE } from '../maze'
import {operatorFactory} from '../actors/operator'
import { morseFactory, signals } from '../actors/morsetx'
import Lava from '../actors/lava'
const arrayToCSV = require('array-to-csv')

export default class extends Phaser.State {
  init() { }
  preload() {
    this.mazeX = 0;
    this.mazeY = 6;
    this.mazeWidth = 59;
    this.mazeHeight = 13;

    this.lavaStartTimeMS = 100;

    this.reset()
  }

  reset() {
    // Setup groups
    this.gTilemap = this.gTilemap || this.game.add.group();
    this.gActors = this.gActors || this.game.add.group();
    this.gTx = this.gTx || this.game.add.group();
    this.gLava = this.gLava || this.game.add.group();
    if (!this.gSignal) {
      this.gSignal = this.game.add.group();
      this.gSignal.enableBody = true;
      this.gSignal.physicsBodyType = Phaser.Physics.ARCADE;
      this.gSignal.createMultiple(30, 'signal');
      this.gSignal.setAll('anchor.x', 0.5);
      this.gSignal.setAll('anchor.y', 0.5);
      this.gSignal.setAll('outOfBoundsKill', true);
      this.gSignal.setAll('checkWorldBounds', true);
    }

    // Kill all children in case groups are from previous game
    this.gActors.forEachAlive(o => o.destroy(), this);
    this.gTx.forEachAlive(o => o.destroy(), this);
    this.gSignal.forEachAlive(o => o.destroy(), this);

    this.gTx.enableBody = true;

    // Create the dweller
    if (!this.dweller) {
      this.dweller = new Dweller({
        game: this.game,
        x: 35,
        y: 35,
        asset: 'dweller',
        gamepad: game.input.gamepad.pad1,
      })
      this.game.add.existing(this.dweller);
    }
    this.dweller.reset();

    // Prepare the maze tilemap
    var operatorMap = Array(5).fill(
      [
        TILE_TYPE.CLEAR,
        ...Array(config.horizontalTiles - 1).fill(TILE_TYPE.CLEAR),
      ]
    )
    operatorMap.push(Array(config.horizontalTiles).fill(TILE_TYPE.PLAYER_WALL));
    for (let i = 0; i < config.verticalTiles - operatorMap.length - 2; i++) {
      let arr = Array(config.horizontalTiles).fill(TILE_TYPE.CLEAR)
      operatorMap.push(arr);
    }
    operatorMap.push(Array(config.horizontalTiles).fill(TILE_TYPE.PLAYER_WALL));

    // Generate the maze
    generateMaze(operatorMap,
      this.mazeX, this.mazeY, this.mazeWidth, this.mazeHeight,
      this.dweller, this.gActors,
      0.4, 0.25,
      this.gTx
    );

    // Create the tilemap
    operatorMap = arrayToCSV(operatorMap);
    game.cache.addTilemap('world', null, operatorMap, Phaser.Tilemap.CSV);
    this.map = game.add.tilemap('world', config.tileWidth, config.tileHeight);
    this.map.addTilesetImage('tiles1');
    this.map.setCollisionByExclusion([TILE_TYPE.CLEAR, TILE_TYPE.GOAL])
    this.layer = this.map.createLayer(0);
    this.layer.resizeWorld();
    this.gTilemap.add(this.layer);
    
    // Create the operator
    this.operator = game.add.existing(
      new Operator(
        this.game, 
        32, 
        40, 
        'operator', 
        game.input.gamepad.pad2, 
        this.gSignal
      )
    );

    // Setup lava
    if (!this.lava) {
      this.lava = new Lava(
        this.game,
        this.mazeX * config.tileWidth,
        this.mazeY * config.tileHeight,
        (this.mazeWidth + 1) * config.tileWidth,
        this.mazeHeight * config.tileHeight,
      );
      this.gLava.add(this.lava);
    }
    // Locate lava to the left of the screen
    this.lava.x = -config.horizontalTiles * (config.tileWidth + 1);
    // Start the lava timer
    game.time.events.add(
      this.lavaStartTimeMS, 
      this.lava.start, 
      this.lava
    );

    this.antenna = game.add.existing(new Phaser.Sprite(game, 32, 46, 'antenna'))
    this.antenna.anchor.set(0.5, 1)
  }

  create() {
    // Start gamepads to track controller input
    game.input.gamepad.start();

    // Enable physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // DEBUG
<<<<<<< HEAD
    game.input.keyboard.addKey(Phaser.Keyboard.Q).onDown.add(function() {
=======
    game.input.keyboard.addKey(Phaser.Keyboard.Q).onDown.add(function () {
      console.log(this);
>>>>>>> 7ec9ab70ac68d4cabf3c4ae443d90a39da8e92c9
      let i = Math.floor(signals.length * Math.random());
      let pattern = signals[i].pattern;
      morseFactory(this.game, this.gTx, pattern);
    }.bind(this), this);

    game.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(function () {
      this.gTx.forEachAlive(tx => {
        tx.kill();
      });
    }.bind(this), this);
  }
<<<<<<< HEAD

  collideActor(collider, actor) {
    console.log('COLLIDING');
=======
  swapGamepads() {
    console.log("swapping gamepads")
    this.gSignal.forEachAlive(alive => {
      alive.kill()
    })
    this.dweller.swapGamepad();
    this.operator.swapGamepad();
  }
  
  collideActors(collider, actor) {
>>>>>>> 7ec9ab70ac68d4cabf3c4ae443d90a39da8e92c9
    actor.collide(collider);
  }

  collideCollider(collider, actor) {
    console.log('COLLIDING');
    collider.collide(actor);
  }

  update() {
    game.physics.arcade.collide(this.dweller, this.layer);
<<<<<<< HEAD
    game.physics.arcade.collide(this.dweller, this.gActors, this.collideActor);
    game.physics.arcade.collide(this.gtX, this.gSignal, this.collideActor);    
    game.physics.arcade.overlap(this.dweller, this.gLava, this.collideCollider);
=======
    game.physics.arcade.collide(this.dweller, this.gActors, this.collideActors);

    game.physics.arcade.overlap(this.gSignal, this.gTx, this.collideActors);

>>>>>>> 7ec9ab70ac68d4cabf3c4ae443d90a39da8e92c9
  }

  render() {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
