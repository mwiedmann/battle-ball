import { state } from './states'
import { titleUpdate } from './states/title'
import { gameUpdate } from './states/game'
import { goalScoredUpdate } from './states/goal-scored'

const updateFunctions = {
  title: titleUpdate,
  game: gameUpdate,
  goalScored: goalScoredUpdate,
}

export function update(this: Phaser.Scene, time: number, delta: number) {
  updateFunctions[state.gameState](this, time, delta)
}
