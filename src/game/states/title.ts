import { settingsHelpers, gameSettings } from '../consts'
import { controls, titleScreen } from '../game-init'
import { state } from '.'
import { createBall } from '../game-objects/ball'
import { createGuy } from '../game-objects/guy'

export const titleUpdate = (scene: Phaser.Scene, time: number, delta: number) => {
  const spacebar = controls.spacebar!

  // When spacebar pressed, close the title screen and create a player and ball for testing
  if (spacebar.isDown) {
    state.gameState = 'game'
    titleScreen.destroy()

    state.guy = createGuy(scene)

    const goalShape = scene.cache.json.get('goal')
    state.goal = scene.matter.add.image(300, settingsHelpers.fieldHeightMid, 'goal', undefined, {
      shape: goalShape.goal,
      isStatic: true,
    } as any)

    state.ball = createBall(scene)

    // Guy can pick ball
    state.ball.setOnCollideWith(state.guy!, (data: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      state.guy?.grabBall(state.ball!)
    })

    scene.cameras.main.setZoom(gameSettings.gameCameraZoom)
    scene.cameras.main.setDeadzone(200, 200)
    scene.cameras.main.startFollow(state.guy)
    scene.cameras.main.setLerp(0.1, 0.1)

    state.mapCamera = scene.cameras.add(0, 0, settingsHelpers.mapCameraWidth, settingsHelpers.mapCameraHeight)
    state.mapCamera.setScroll(settingsHelpers.fieldWidthMid, settingsHelpers.fieldHeightMid)
    state.mapCamera.setZoom(gameSettings.mapCameraZoom)
  }
}
