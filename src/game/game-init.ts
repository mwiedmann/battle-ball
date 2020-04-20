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
  this.load.image('test', 'images/test-sprite.png')
}

/** Create all the physics groups we need and setup colliders between the ones we want to interact. */
function create(this: Phaser.Scene) {
  controls.cursors = this.input.keyboard.createCursorKeys()
  controls.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

  this.add.image(settingsHelpers.fieldWidthMid, settingsHelpers.fieldHeightMid, 'background')
  this.add.image(settingsHelpers.fieldWidthMid - 300, settingsHelpers.fieldHeightMid, 'test')

  titleScreen = this.add.image(settingsHelpers.fieldWidthMid, settingsHelpers.fieldHeightMid, 'title')

  this.physics.world.setBounds(
    -gameSettings.worldBoundEdgeSize,
    -gameSettings.worldBoundEdgeSize,
    settingsHelpers.worldBoundWidth,
    settingsHelpers.worldBoundHeight
  )
  this.physics.world.setBoundsCollision(true, true, true, true)

  this.physics.world.on('worldbounds', function (body: any) {
    if (body.gameObject.edgeCollide) {
      body.gameObject.edgeCollide()
    }
  })
}

export const startGame = () => {
  new Phaser.Game({
    type: Phaser.AUTO,
    width: gameSettings.fieldWidth,
    height: gameSettings.fieldHeight,
    scale: {
      mode: Phaser.Scale.ScaleModes.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
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
