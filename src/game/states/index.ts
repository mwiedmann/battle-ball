import { Ball } from '../game-objects/ball'
import { Guy } from '../game-objects/guy'
import { ITeam } from '../types'

type IGameState = 'title' | 'faceOff' | 'game' | 'goalScored'

export interface IState {
  gameState: IGameState
  ball?: Ball
  homeTeam: Guy[]
  awayTeam: Guy[]

  homeScore: number
  homeText?: Phaser.GameObjects.Text
  homeScoreImage?: Phaser.GameObjects.Image
  awayScore: number
  awayText?: Phaser.GameObjects.Text
  awayScoreImage?: Phaser.GameObjects.Image

  // This will be refactored to support more players but its fine for now
  player1?: Guy
  player2?: Guy

  player1AI: boolean
  player2AI: boolean

  homeGoal?: Phaser.Physics.Matter.Image
  awayGoal?: Phaser.Physics.Matter.Image
  homeScoreArea?: MatterJS.BodyType
  awayScoreArea?: MatterJS.BodyType

  mapCamera?: Phaser.Cameras.Scene2D.Camera

  nextStateTransitionTime: number

  debugImage?: Phaser.GameObjects.Image

  onOffense: (team: ITeam) => boolean
  onDefense: (team: ITeam) => boolean
  hasBall: (team: ITeam) => boolean
  looseBall: (team: ITeam) => boolean

  getTeammates: (guy: Guy) => Guy[]
}

export const state: IState = {
  gameState: 'title',
  player1AI: false,
  player2AI: true,
  homeScore: 0,
  awayScore: 0,
  homeTeam: [],
  awayTeam: [],
  nextStateTransitionTime: 0,
  hasBall: (team: ITeam) =>
    (team === 'home' && state.player1?.ball != undefined) || (team === 'away' && state.player2?.ball != undefined),
  onOffense: (team: ITeam) => state.hasBall(team),
  onDefense: (team: ITeam) => !state.hasBall(team),
  looseBall: (team: ITeam) => !state.player1?.ball && !state.player2?.ball,
  getTeammates: (guy: Guy) =>
    guy.team === 'home' ? state.homeTeam.filter((g) => g !== guy) : state.awayTeam.filter((g) => g !== guy),
}
