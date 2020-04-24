import { Ball } from '../game-objects/ball'
import { Guy } from '../game-objects/guy'

type IGameState = 'title' | 'game'

export interface IState {
  gameState: IGameState
  ball?: Ball
  homeTeam: Guy[]
  awayTeam: Guy[]

  // This will be refactored to support more players but its fine for now
  player1?: Guy
  player2?: Guy

  goal?: Phaser.Physics.Matter.Image
  mapCamera?: Phaser.Cameras.Scene2D.Camera
}

export const state: IState = {
  gameState: 'title',
  homeTeam: [],
  awayTeam: [],
}