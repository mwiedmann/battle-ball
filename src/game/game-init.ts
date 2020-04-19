import * as Phaser from 'phaser'
import { settingsHelpers, gameSettings } from './consts'

export let titleScreen: Phaser.GameObjects.Image

/** Load all the images we need and assign them names */
function preload(this: Phaser.Scene) {
  this.load.image('background', 'images/background.jpg')
  this.load.image('title', 'images/title-screen.png')
}

/** Create all the physics groups we need and setup colliders between the ones we want to interact. */
function create(this: Phaser.Scene) {
  titleScreen = this.add.image(settingsHelpers.screenWidthMid, settingsHelpers.screenHeightMid, 'title')

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
    width: gameSettings.screenWidth,
    height: gameSettings.screenHeight,
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
      preload: preload,
      create: create,
      update: () => {},
    },
    input: {
      gamepad: true,
    },
    parent: 'root',
  })
}
