import { Ball } from '../game-objects/ball'
import { Guy } from '../game-objects/guy'

type IGameState = 'title' | 'game'

export interface IState {
  gameState: IGameState
  ball?: Ball
  guy?: Guy
  goal?: Phaser.Physics.Matter.Image
  mapCamera?: Phaser.Cameras.Scene2D.Camera
}

export const state: IState = {
  gameState: 'title',
}
