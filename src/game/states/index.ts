import { Ball } from '../game-objects/ball'
import { Guy } from '../game-objects/guy'

type IGameState = 'title' | 'game' | 'goalScored'

export interface IState {
  gameState: IGameState
  ball?: Ball
  homeTeam: Guy[]
  awayTeam: Guy[]

  // This will be refactored to support more players but its fine for now
  player1?: Guy
  player2?: Guy

  homeGoal?: Phaser.Physics.Matter.Image
  awayGoal?: Phaser.Physics.Matter.Image
  homeScoreArea?: MatterJS.BodyType
  awayScoreArea?: MatterJS.BodyType

  mapCamera?: Phaser.Cameras.Scene2D.Camera

  goalScoredTransitionTime: number
}

export const state: IState = {
  gameState: 'title',
  homeTeam: [],
  awayTeam: [],
  goalScoredTransitionTime: 0,
}
