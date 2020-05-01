import { state } from '.'
import { gameSettings, settingsHelpers } from '../consts'
import { gameState } from '../update'

let readyText: Phaser.GameObjects.Text | undefined

export const faceOffUpdate = (scene: Phaser.Scene, time: number, delta: number, init: boolean) => {
  if (gameState.nextStateTransitionTime <= scene.time.now) {
    gameState.phase = 'game'
    readyText?.destroy()
    readyText = undefined
    return
  }

  if (!readyText) {
    readyText = scene.add.text(settingsHelpers.fieldWidthMid - 190, settingsHelpers.fieldHeightMid - 350, '', {
      fontSize: '60px',
      color: 'green',
      fontFamily: 'Verdana',
      align: 'center',
      fontStyle: 'bold',
    })
  }

  const remainingTime = Phaser.Math.CeilTo((gameState.nextStateTransitionTime - scene.time.now) / 1000, 0)
  readyText.text = `GET READY\n${remainingTime}`
}
