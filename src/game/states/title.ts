import { settingsHelpers, gameSettings } from '../consts'
import { controls, titleScreen } from '../game-init'
import { state } from '.'
import { createBall } from '../game-objects/ball'
import { createGuy, Guy } from '../game-objects/guy'
import { createGoal } from '../game-objects/goal'

export const titleUpdate = (scene: Phaser.Scene, time: number, delta: number) => {
  // When spacebar pressed, close the title screen and create a player and ball for testing
  if (controls.spacebar.isDown) {
    state.gameState = 'game'
    titleScreen.destroy()

    state.player1 = createGuy(scene, 'home')
    state.homeTeam.push(state.player1)

    state.player2 = createGuy(scene, 'away')
    state.awayTeam.push(state.player2)

    state.homeGoal = createGoal(scene, 'home')
    state.awayGoal = createGoal(scene, 'away')

    state.ball = createBall(scene)

    // Players can grab the ball
    state.ball.setOnCollideWith([...state.homeTeam, ...state.awayTeam], (
      data: any /*Phaser.Types.Physics.Matter.MatterCollisionData */
    ) => {
      data.gameObject.grabBall(state.ball!)
    })

    scene.cameras.main.setZoom(gameSettings.gameCameraZoom)
    scene.cameras.main.setDeadzone(200, 200)
    scene.cameras.main.startFollow(state.ball)
    scene.cameras.main.setLerp(0.1, 0.1)

    state.mapCamera = scene.cameras.add(0, 0, settingsHelpers.mapCameraWidth, settingsHelpers.mapCameraHeight)
    state.mapCamera.setScroll(settingsHelpers.fieldWidthMid, settingsHelpers.fieldHeightMid)
    state.mapCamera.setZoom(gameSettings.mapCameraZoom)
  }
}
