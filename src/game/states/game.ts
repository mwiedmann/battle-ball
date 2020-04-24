import { controls } from '../game-init'
import { state } from '.'

export const gameUpdate = (scene: Phaser.Scene, time: number, delta: number) => {
  state.homeTeam?.forEach((p) => p.update())
  state.awayTeam?.forEach((p) => p.update())
  state.ball?.update()
}
