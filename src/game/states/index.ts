import { Ball, createBall } from '../game-objects/ball'
import { Guy, createGuy } from '../game-objects/guy'
import { ITeam } from '../types'
import { teamConfigSettings } from './title'
import { createGoal, Goal } from '../game-objects/goal'

export interface IState {
  goalScoredByTeam?: ITeam
  ball: Ball

  homeTeam: Guy[]
  awayTeam: Guy[]

  awayClosestToBall?: Guy
  homeClosestToBall?: Guy

  homeScore: number
  homeText: Phaser.GameObjects.Text

  homeScoreImage: Phaser.GameObjects.Image
  awayScore: number
  awayText: Phaser.GameObjects.Text
  awayScoreImage: Phaser.GameObjects.Image

  // This will be refactored to support more players but its fine for now
  player1: Guy
  player2: Guy

  homeGoalie: Guy
  awayGoalie: Guy

  player1AI: boolean
  player2AI: boolean

  homeGoal: Goal
  awayGoal: Goal

  mapCamera?: Phaser.Cameras.Scene2D.Camera

  debugImage?: Phaser.GameObjects.Image

  onOffense: (team: ITeam) => boolean
  onDefense: (team: ITeam) => boolean
  hasBall: (team: ITeam) => boolean
  looseBall: () => boolean

  getTeammates: (guy: Guy) => Guy[]
  getFirstPlayer: (team: ITeam, predicate: (p: Guy) => boolean) => Guy
  allPlayers: () => Guy[]
}

export let state: IState

export const constructState = (scene: Phaser.Scene) => {
  state = {
    player1AI: false,
    player2AI: true,
    homeScore: 0,
    awayScore: 0,
    homeTeam: [],
    awayTeam: [],

    player1: createGuy(scene, 'home', 'center', teamConfigSettings['home']['center'].level),
    homeGoalie: createGuy(scene, 'home', 'goalie', teamConfigSettings['home']['goalie'].level),

    player2: createGuy(scene, 'away', 'center', teamConfigSettings['away']['center'].level),
    awayGoalie: createGuy(scene, 'away', 'goalie', teamConfigSettings['away']['goalie'].level),

    homeGoal: createGoal(scene, 'home'),
    awayGoal: createGoal(scene, 'away'),
    ball: createBall(scene),

    homeScoreImage: scene.add.image(360, 180, 'home-score').setScrollFactor(0),
    awayScoreImage: scene.add.image(1560, 180, 'away-score').setScrollFactor(0),

    homeText: scene.add
      .text(410, 145, '0', { fontSize: '60px', color: '#0094FF', fontFamily: 'Verdana' })
      .setScrollFactor(0),
    awayText: scene.add
      .text(1605, 145, '0', { fontSize: '60px', color: '#FF0000', fontFamily: 'Verdana' })
      .setScrollFactor(0),

    hasBall: (team: ITeam) =>
      (team === 'home' && state.player1.ball != undefined) || (team === 'away' && state.player2.ball != undefined),
    onOffense: (team: ITeam) =>
      ((team === 'home' && !state.homeGoalie.ball) || (team === 'away' && !state.awayGoalie.ball)) &&
      state.hasBall(team),
    onDefense: (team: ITeam) => !state.hasBall(team),
    looseBall: () => !state.player1.ball && !state.player2.ball,
    getTeammates: (guy: Guy) =>
      guy.team === 'home' ? state.homeTeam.filter((g) => g !== guy) : state.awayTeam.filter((g) => g !== guy),

    allPlayers: () => [...state.homeTeam, ...state.awayTeam],

    getFirstPlayer: (team: ITeam, predicate: (p: Guy) => boolean) => {
      const guys = team === 'home' ? state.homeTeam : state.awayTeam
      const guy = guys.find(predicate)
      if (!guy) {
        throw new Error('Could not find player')
      }
      return guy
    },
  }

  state.homeTeam.push(state.player1)
  state.player1.setHighlight()

  state.homeTeam.push(state.homeGoalie)
  state.homeTeam.push(createGuy(scene, 'home', 'wing', teamConfigSettings['home']['wing'].level))
  state.homeTeam.push(createGuy(scene, 'home', 'defense', teamConfigSettings['home']['defense'].level))

  state.awayTeam.push(state.player2)
  state.player2.setHighlight()

  state.awayTeam.push(state.awayGoalie)
  state.awayTeam.push(createGuy(scene, 'away', 'wing', teamConfigSettings['away']['wing'].level))
  state.awayTeam.push(createGuy(scene, 'away', 'defense', teamConfigSettings['away']['defense'].level))

  const gotHitCollisionCheck = (
    data: { gameObject: Guy },
    collision: Phaser.Types.Physics.Matter.MatterCollisionData
  ) => {
    if (!collision.bodyB.gameObject.stunnedTime && data.gameObject.ball) {
      data.gameObject.gotHit(collision.bodyB.gameObject)
    }
  }

  state.homeTeam.forEach((p) => p.setOnCollideWith(state.awayTeam, gotHitCollisionCheck))
  state.awayTeam.forEach((p) => p.setOnCollideWith(state.homeTeam, gotHitCollisionCheck))

  // Players can grab the ball
  state.ball.setOnCollideWith([...state.homeTeam, ...state.awayTeam], (
    data: any /*Phaser.Types.Physics.Matter.MatterCollisionData */
  ) => {
    data.gameObject.grabBall(state.ball)
  })
}
