import { controls, titleScreen } from './game-init'
import { gameSettings, settingsHelpers } from './consts'

export type IGameState = 'title' | 'game'
export let gameState = 'title'

export function update(this: Phaser.Scene, time: number, delta: number) {
  // Grab the global cursor controls
  const cursors = controls.cursors!
  const spacebar = controls.spacebar!

  if (gameState === 'title' && spacebar.isDown) {
    gameState = 'game'
    titleScreen.destroy()
    this.cameras.main.setZoom(gameSettings.gameCameraZoom)
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
