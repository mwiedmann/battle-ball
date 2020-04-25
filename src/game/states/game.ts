import { state } from '.'

export const gameUpdate = (scene: Phaser.Scene, time: number, delta: number) => {
  state.homeTeam?.forEach((p) => p.update())
  state.awayTeam?.forEach((p) => p.update())
  state.ball?.update()

  // Check for a goal scored
  if (scene.matter.overlap(state.ball!, [state.homeScoreArea!])) {
    state.gameState = 'goalScored'
    state.goalScoredTransitionTime = scene.time.now + 5000
    state.awayScore++
    updateScoreText()
  }

  if (scene.matter.overlap(state.ball!, [state.awayScoreArea!])) {
    state.gameState = 'goalScored'
    state.goalScoredTransitionTime = scene.time.now + 5000
    state.homeScore++
    updateScoreText()
  }
}

const updateScoreText = () => {
  state.awayText!.text = state.awayScore.toString()
  state.homeText!.text = state.homeScore.toString()
}
