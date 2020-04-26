import { Ball } from '../game-objects/ball'
import { Guy } from '../game-objects/guy'

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

  homeGoal?: Phaser.Physics.Matter.Image
  awayGoal?: Phaser.Physics.Matter.Image
  homeScoreArea?: MatterJS.BodyType
  awayScoreArea?: MatterJS.BodyType

  mapCamera?: Phaser.Cameras.Scene2D.Camera

  nextStateTransitionTime: number

  debugImage?: Phaser.GameObjects.Image
}

export const state: IState = {
  gameState: 'title',
  homeScore: 0,
  awayScore: 0,
  homeTeam: [],
  awayTeam: [],
  nextStateTransitionTime: 0,
}
