import { state } from '.'
import { Scene } from 'phaser'
import { closestNonGoalie } from '../helpers/guy-helper'
import { gameState } from '../update'

export const gameUpdate = (scene: Phaser.Scene, time: number, delta: number, init: boolean) => {
  // Set the player(s) closest to the ball on each team
  const looseBall = state.looseBall()
  state.homeClosestToBall = undefined
  state.awayClosestToBall = undefined

  if (looseBall || state.hasBall('home')) {
    state.awayClosestToBall = closestNonGoalie(state.awayTeam, state.ball.x, state.ball.y)
  }
  if (looseBall || state.hasBall('away')) {
    state.homeClosestToBall = closestNonGoalie(state.homeTeam, state.ball.x, state.ball.y)
  }

  state.homeTeam.forEach((p) => p.update())
  state.awayTeam.forEach((p) => p.update())
  state.ball.update()

  // Check for a goal scored
  if (scene.matter.overlap(state.ball, [state.homeGoal.scoreArea])) {
    goalScored(scene, 0, 1)
  }

  if (scene.matter.overlap(state.ball, [state.awayGoal.scoreArea])) {
    goalScored(scene, 1, 0)
  }
}

const goalScored = (scene: Phaser.Scene, homeAdj: number, awayAdj: number) => {
  gameState.phase = 'goalScored'
  gameState.nextStateTransitionTime = scene.time.now + 3000

  state.goalScoredByTeam = homeAdj > 0 ? 'home' : 'away'
  state.awayScore += awayAdj
  state.homeScore += homeAdj

  state.awayText.text = state.awayScore.toString()
  state.homeText.text = state.homeScore.toString()

  scene.cameras.main.shake(2500, 0.0025)
  scene.cameras.main.flash(250, awayAdj ? 255 : 0, 0, homeAdj ? 255 : 0)

  state.player1 = state.getFirstPlayer('home', (p) => p.position === 'center')
  state.player2 = state.getFirstPlayer('away', (p) => p.position === 'center')

  state.homeTeam.forEach((p) => p.setHighlight())
  state.awayTeam.forEach((p) => p.setHighlight())
}
