import * as Phaser from 'phaser'
import { settingsHelpers, gameSettings } from './consts'
import { update } from './update'

export let titleScreen: Phaser.GameObjects.Image

export let controls: {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys
  p1Shoot: Phaser.Input.Keyboard.Key
  p1Pass: Phaser.Input.Keyboard.Key
  retrieveBall: Phaser.Input.Keyboard.Key
  p2Up: Phaser.Input.Keyboard.Key
  p2Down: Phaser.Input.Keyboard.Key
  p2Left: Phaser.Input.Keyboard.Key
  p2Right: Phaser.Input.Keyboard.Key
  p2Shoot: Phaser.Input.Keyboard.Key
  p2Pass: Phaser.Input.Keyboard.Key
}

/** Load all the images we need and assign them names */
function preload(this: Phaser.Scene) {
  this.load.image('background', 'images/background.png')
  this.load.image('title', 'images/title-screen.png')
  this.load.image('goal', 'images/goal.png')
  this.load.image('ball', 'images/ball.png')
  this.load.spritesheet('home-player', 'images/blue-guy.png', { frameWidth: 64 })
  this.load.spritesheet('away-player', 'images/red-guy.png', { frameWidth: 64 })
  this.load.image('home-score', 'images/home-score.png')
  this.load.image('away-score', 'images/away-score.png')
  this.load.image('x', 'images/x.png')

  // Load json for special shapes
  this.load.json('goal', 'images/goal.json')
}

/** Create all the physics groups we need and setup colliders between the ones we want to interact. */
function create(this: Phaser.Scene) {
  controls = {
    cursors: this.input.keyboard.createCursorKeys(),
    p1Shoot: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL),
    p1Pass: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ALT),
    retrieveBall: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R),
    p2Up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
    p2Down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
    p2Left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
    p2Right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    p2Shoot: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
    p2Pass: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
  }

  this.add.image(settingsHelpers.fieldWidthMid, settingsHelpers.fieldHeightMid, 'background')

  titleScreen = this.add.image(settingsHelpers.fieldWidthMid, settingsHelpers.fieldHeightMid, 'title')
  this.matter.world.setBounds(0, 0, settingsHelpers.worldBoundWidth, settingsHelpers.worldBoundHeight)
}

export const startGame = () => {
  new Phaser.Game({
    type: Phaser.AUTO,
    width: gameSettings.screenWidth,
    height: gameSettings.screenHeight,
    scale: {
      mode: Phaser.Scale.ScaleModes.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'matter',
      matter: {
        enableSleeping: true,
        gravity: {
          y: 0,
          x: 0,
        },
      },
    },
    scene: {
      preload,
      create,
      update,
    },
    input: {
      gamepad: true,
    },
    parent: 'root',
  })
}
