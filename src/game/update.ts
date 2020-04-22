import { controls, titleScreen } from './game-init'
import { gameSettings, settingsHelpers } from './consts'

export type IGameState = 'title' | 'game'
export let gameState = 'title'

let testObject: Phaser.Physics.Arcade.Image
let mapCamera: Phaser.Cameras.Scene2D.Camera

export function update(this: Phaser.Scene, time: number, delta: number) {
  // Grab the global cursor controls
  const cursors = controls.cursors!
  const spacebar = controls.spacebar!

  if (gameState === 'title' && spacebar.isDown) {
    gameState = 'game'
    titleScreen.destroy()

    testObject = this.physics.add.image(100, 100, 'test')
    testObject.setCollideWorldBounds(true)
    testObject.setBounce(1, 1)
    testObject.setVelocity(400, 300)

    this.cameras.main.setZoom(gameSettings.gameCameraZoom)
    this.cameras.main.setDeadzone(200, 200)
    this.cameras.main.startFollow(testObject)
    this.cameras.main.setLerp(0.1, 0.1)

    mapCamera = this.cameras.add(0, 0, settingsHelpers.mapCameraWidth, settingsHelpers.mapCameraHeight)
    mapCamera.setScroll(settingsHelpers.fieldWidthMid, settingsHelpers.fieldHeightMid)
    mapCamera.setZoom(gameSettings.mapCameraZoom)
  }

  if (gameState === 'game') {
    if (cursors.down?.isDown) {
      this.cameras.main.scrollY = this.cameras.main.scrollY + 5
    }
    if (cursors.up?.isDown) {
      this.cameras.main.scrollY = this.cameras.main.scrollY - 5
    }
    if (cursors.right?.isDown) {
      this.cameras.main.scrollX = this.cameras.main.scrollX + 5
    }
    if (cursors.left?.isDown) {
      this.cameras.main.scrollX = this.cameras.main.scrollX - 5
    }
  }
}
