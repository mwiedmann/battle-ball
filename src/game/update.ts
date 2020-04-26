import { state } from './states'
import { titleUpdate } from './states/title'
import { gameUpdate } from './states/game'
import { goalScoredUpdate } from './states/goal-scored'
import { faceOffUpdate } from './states/face-off'

const updateFunctions = {
  title: titleUpdate,
  game: gameUpdate,
  goalScored: goalScoredUpdate,
  faceOff: faceOffUpdate,
}

export function update(this: Phaser.Scene, time: number, delta: number) {
  updateFunctions[state.gameState](this, time, delta)
}
