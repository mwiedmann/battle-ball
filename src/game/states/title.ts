import { settingsHelpers, gameSettings } from '../consts'
import { controls, titleScreen } from '../game-init'
import { state } from '.'
import { createBall } from '../game-objects/ball'
import { createGuy, Guy } from '../game-objects/guy'
import { createGoal } from '../game-objects/goal'

export const titleUpdate = (scene: Phaser.Scene, time: number, delta: number) => {
  // When spacebar pressed, close the title screen and create a player and ball for testing
  if (controls.p1Shoot.isDown) {
    state.gameState = 'faceOff'
    state.nextStateTransitionTime = scene.time.now + 3000

    titleScreen.destroy()

    const defaultLevel = 'allStar'

    state.player1 = createGuy(scene, 'home', 'center', defaultLevel)
    state.homeTeam.push(state.player1)
    state.player1.setHighlight()
    state.homeGoalie = createGuy(scene, 'home', 'goalie', defaultLevel)
    state.homeTeam.push(state.homeGoalie)
    state.homeTeam.push(createGuy(scene, 'home', 'wing', defaultLevel))
    state.homeTeam.push(createGuy(scene, 'home', 'defense', defaultLevel))

    state.player2 = createGuy(scene, 'away', 'center', defaultLevel)
    state.awayTeam.push(state.player2)
    state.player2.setHighlight()
    state.awayGoalie = createGuy(scene, 'away', 'goalie', defaultLevel)
    state.awayTeam.push(state.awayGoalie)
    state.awayTeam.push(createGuy(scene, 'away', 'wing', defaultLevel))
    state.awayTeam.push(createGuy(scene, 'away', 'defense', defaultLevel))

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

    state.homeGoal = createGoal(scene, 'home')
    state.awayGoal = createGoal(scene, 'away')

    state.ball = createBall(scene)

    state.homeScoreImage = scene.add.image(360, 180, 'home-score').setScrollFactor(0)
    state.homeText = scene.add
      .text(410, 145, '0', { fontSize: '60px', color: '#0094FF', fontFamily: 'Verdana' })
      .setScrollFactor(0)

    state.awayScoreImage = scene.add.image(1560, 180, 'away-score').setScrollFactor(0)
    state.awayText = scene.add
      .text(1605, 145, '0', { fontSize: '60px', color: '#FF0000', fontFamily: 'Verdana' })
      .setScrollFactor(0)

    // Players can grab the ball
    state.ball.setOnCollideWith([...state.homeTeam, ...state.awayTeam], (
      data: any /*Phaser.Types.Physics.Matter.MatterCollisionData */
    ) => {
      data.gameObject.grabBall(state.ball!)
    })

    scene.cameras.main.setZoom(gameSettings.gameCameraZoom)
    scene.cameras.main.setDeadzone(100, 100)
    scene.cameras.main.startFollow(state.ball)
    scene.cameras.main.setLerp(0.1, 0.1)
    scene.cameras.main.setBounds(0, 0, gameSettings.fieldWidth, gameSettings.fieldHeight)

    // Don't think we really need a mini-map in this game
    // Keep code here for reference though
    // state.mapCamera = scene.cameras.add(0, 0, settingsHelpers.mapCameraWidth, settingsHelpers.mapCameraHeight)
    // state.mapCamera.setScroll(settingsHelpers.fieldWidthMid, settingsHelpers.fieldHeightMid)
    // state.mapCamera.setZoom(gameSettings.mapCameraZoom)

    // state.debugImage = scene.add.image(0, 0, 'x')
  }
}
