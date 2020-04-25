import { state } from '.'

export const goalScoredUpdate = (scene: Phaser.Scene, time: number, delta: number) => {
  // See if celebration time is over
  if (state.goalScoredTransitionTime <= scene.time.now) {
    state.ball?.startingPosition()
    state.player1?.startingPosition()
    state.player2?.startingPosition()

    state.gameState = 'game'
  }

  // Move the players back to their starting positions
  state.awayTeam.forEach((p) => p.moveToStartingPosition())
  state.homeTeam.forEach((p) => p.moveToStartingPosition())
}
