import { state } from './states'
import { titleUpdate } from './states/title'
import { gameUpdate } from './states/game'

const updateFunctions = {
  title: titleUpdate,
  game: gameUpdate,
}

export function update(this: Phaser.Scene, time: number, delta: number) {
  updateFunctions[state.gameState](this, time, delta)
}
