import { controls } from '../game-init'
import { state } from '.'

export const gameUpdate = (scene: Phaser.Scene, time: number, delta: number) => {
  state.guy?.update()
}
