import { state } from '.'
import { gameState } from '../update'

export const goalScoredUpdate = (scene: Phaser.Scene, time: number, delta: number, init: boolean) => {
  // See if celebration time is over
  if (gameState.nextStateTransitionTime <= scene.time.now) {
    state.ball.startingPosition()
    state.player1.startingPosition(state.goalScoredByTeam === 'home')
    state.player2.startingPosition(state.goalScoredByTeam === 'away')

    gameState.phase = 'faceOff'
    gameState.nextStateTransitionTime = scene.time.now + 3000
  }

  // Move the players back to their starting positions
  state.awayTeam.forEach((p) => p.moveToStartingPosition(state.goalScoredByTeam === 'away'))
  state.homeTeam.forEach((p) => p.moveToStartingPosition(state.goalScoredByTeam === 'home'))
}
