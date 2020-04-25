import { state } from '.'

export const goalScoredUpdate = (scene: Phaser.Scene, time: number, delta: number) => {
  if (state.goalScoredTransitionTime <= scene.time.now) {
    state.ball?.startingPosition()
    state.player1?.startingPosition()
    state.player2?.startingPosition()

    state.gameState = 'game'
  }
}
