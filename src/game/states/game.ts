import { state } from '.'
import { Scene } from 'phaser'
import { closestNonGoalie } from '../helpers/guy-helper'

export const gameUpdate = (scene: Phaser.Scene, time: number, delta: number, init: boolean) => {
  // Set the player(s) closest to the ball on each team
  const looseBall = state.looseBall()
  state.homeClosestToBall = undefined
  state.awayClosestToBall = undefined

  const ball = state.ballGet()

  if (looseBall || state.hasBall('home')) {
    state.awayClosestToBall = closestNonGoalie(state.awayTeam, ball.x, ball.y)
  }
  if (looseBall || state.hasBall('away')) {
    state.homeClosestToBall = closestNonGoalie(state.homeTeam, ball.x, ball.y)
  }

  state.homeTeam?.forEach((p) => p.update())
  state.awayTeam?.forEach((p) => p.update())
  state.ball?.update()

  if (!state.homeScoreArea || !state.awayScoreArea) {
    throw new Error('ScoreAreas not defined')
  }

  // Check for a goal scored
  if (scene.matter.overlap(ball, [state.homeScoreArea])) {
    goalScored(scene, 0, 1)
  }

  if (scene.matter.overlap(ball, [state.awayScoreArea])) {
    goalScored(scene, 1, 0)
  }
}

const goalScored = (scene: Phaser.Scene, homeAdj: number, awayAdj: number) => {
  state.gameState = 'goalScored'
  state.goalScoredByTeam = homeAdj > 0 ? 'home' : 'away'
  state.nextStateTransitionTime = scene.time.now + 3000
  state.awayScore += awayAdj
  state.homeScore += homeAdj

  state.awayTextGet().text = state.awayScore.toString()
  state.homeTextGet().text = state.homeScore.toString()

  scene.cameras.main.shake(2500, 0.0025)
  scene.cameras.main.flash(250, awayAdj ? 255 : 0, 0, homeAdj ? 255 : 0)

  state.player1 = state.homeTeam.find((p) => p.position === 'center')
  state.player2 = state.awayTeam.find((p) => p.position === 'center')

  state.homeTeam.forEach((p) => p.setHighlight())
  state.awayTeam.forEach((p) => p.setHighlight())
}
