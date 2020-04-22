import * as Phaser from 'phaser'
import { settingsHelpers, gameSettings } from './consts'
import { update } from './update'

export let titleScreen: Phaser.GameObjects.Image

export const controls: {
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  spacebar?: Phaser.Input.Keyboard.Key
} = {}

/** Load all the images we need and assign them names */
function preload(this: Phaser.Scene) {
  this.load.image('background', 'images/background.png')
  this.load.image('title', 'images/title-screen.png')
  this.load.image('goal', 'images/goal.png')
  this.load.image('test', 'images/ball.png')

  this.load.json('goal', 'images/goal.json')
}

/** Create all the physics groups we need and setup colliders between the ones we want to interact. */
function create(this: Phaser.Scene) {
  controls.cursors = this.input.keyboard.createCursorKeys()
  controls.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

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
        debug: {
          showBody: true,
          showStaticBody: true,
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
