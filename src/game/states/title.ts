import { settingsHelpers, gameSettings } from '../consts'
import { controls, titleScreen } from '../game-init'
import { state } from '.'
import { createBall } from '../game-objects/ball'
import { createGuy, Guy } from '../game-objects/guy'
import { createGoal } from '../game-objects/goal'

export const titleUpdate = (scene: Phaser.Scene, time: number, delta: number) => {
  // When spacebar pressed, close the title screen and create a player and ball for testing
  if (controls.pl1Shoot.isDown) {
    state.gameState = 'game'
    titleScreen.destroy()

    state.player1 = createGuy(scene, 'home', 'center')
    state.homeTeam.push(state.player1)
    state.homeTeam.push(createGuy(scene, 'home', 'goalie'))
    state.homeTeam.push(createGuy(scene, 'home', 'wingLeft'))
    state.homeTeam.push(createGuy(scene, 'home', 'wingRight'))
    state.homeTeam.push(createGuy(scene, 'home', 'defLeft'))
    state.homeTeam.push(createGuy(scene, 'home', 'defRight'))

    state.player2 = createGuy(scene, 'away', 'center')
    state.awayTeam.push(state.player2)
    state.awayTeam.push(createGuy(scene, 'away', 'goalie'))
    state.awayTeam.push(createGuy(scene, 'away', 'wingLeft'))
    state.awayTeam.push(createGuy(scene, 'away', 'wingRight'))
    state.awayTeam.push(createGuy(scene, 'away', 'defLeft'))
    state.awayTeam.push(createGuy(scene, 'away', 'defRight'))

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
