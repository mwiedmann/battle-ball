import { state } from '.'
import { Scene } from 'phaser'

export const gameUpdate = (scene: Phaser.Scene, time: number, delta: number) => {
  state.homeTeam?.forEach((p) => p.update())
  state.awayTeam?.forEach((p) => p.update())
  state.ball?.update()

  // Check for a goal scored
  if (scene.matter.overlap(state.ball!, [state.homeScoreArea!])) {
    goalScored(scene, 0, 1)
  }

  if (scene.matter.overlap(state.ball!, [state.awayScoreArea!])) {
    goalScored(scene, 1, 0)
  }
}

const goalScored = (scene: Phaser.Scene, homeAdj: number, awayAdj: number) => {
  state.gameState = 'goalScored'
  state.goalScoredTransitionTime = scene.time.now + 3000
  state.awayScore += awayAdj
  state.homeScore += homeAdj

  state.awayText!.text = state.awayScore.toString()
  state.homeText!.text = state.homeScore.toString()

  scene.cameras.main.shake(2500, 0.0025)
  scene.cameras.main.flash(250, awayAdj ? 255 : 0, 0, homeAdj ? 255 : 0)

  state.player1 = state.homeTeam.find((p) => p.position === 'center')
  state.player2 = state.awayTeam.find((p) => p.position === 'center')
}
