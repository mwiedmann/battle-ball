import { state } from '.'

export const goalScoredUpdate = (scene: Phaser.Scene, time: number, delta: number) => {
  // See if celebration time is over
  if (state.nextStateTransitionTime <= scene.time.now) {
    state.ball?.startingPosition()
    state.player1?.startingPosition(state.goalScoredByTeam === 'home')
    state.player2?.startingPosition(state.goalScoredByTeam === 'away')

    state.gameState = 'faceOff'
    state.nextStateTransitionTime = scene.time.now + 3000
  }

  // Move the players back to their starting positions
  state.awayTeam.forEach((p) => p.moveToStartingPosition(state.goalScoredByTeam === 'away'))
  state.homeTeam.forEach((p) => p.moveToStartingPosition(state.goalScoredByTeam === 'home'))
}
