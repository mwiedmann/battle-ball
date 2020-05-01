import { titleUpdate } from './states/title'
import { gameUpdate } from './states/game'
import { goalScoredUpdate } from './states/goal-scored'
import { faceOffUpdate } from './states/face-off'

export type IGamePhase = 'title' | 'faceOff' | 'game' | 'goalScored'

interface IGameState {
  phase: IGamePhase
  nextStateTransitionTime: number
}

export const gameState: IGameState = {
  phase: 'title',
  nextStateTransitionTime: 0,
}

const updateFunctions = {
  title: titleUpdate,
  game: gameUpdate,
  goalScored: goalScoredUpdate,
  faceOff: faceOffUpdate,
}

let lastState: IGamePhase | undefined = undefined

export function update(this: Phaser.Scene, time: number, delta: number) {
  let init = false
  if (lastState !== gameState.phase) {
    lastState = gameState.phase
    init = true
  }
  updateFunctions[gameState.phase](this, time, delta, init)
}
