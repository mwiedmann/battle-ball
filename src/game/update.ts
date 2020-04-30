import { state, IGameState } from './states'
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

let lastState: IGameState | undefined = undefined

export function update(this: Phaser.Scene, time: number, delta: number) {
  let init = false
  if (lastState !== state.gameState) {
    lastState = state.gameState
    init = true
  }
  updateFunctions[state.gameState](this, time, delta, init)
}
