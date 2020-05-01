import { settingsHelpers, gameSettings } from '../consts'
import { controls, titleScreen } from '../game-init'
import { state } from '.'
import { createBall } from '../game-objects/ball'
import { createGuy, Guy } from '../game-objects/guy'
import { createGoal } from '../game-objects/goal'
import { IAbilityLevel, IPosition } from '../settings/position'
import { ITeam } from '../types'

const settings: {
  [k in ITeam]: {
    [k in IPosition]: {
      level: IAbilityLevel
      yOffset: number
      buttons?: { [k in IAbilityLevel]?: Phaser.GameObjects.Arc }
    }
  }
} = {
  home: {
    center: { level: 'allStar', yOffset: 715 },
    wing: { level: 'allStar', yOffset: 797 },
    defense: { level: 'allStar', yOffset: 877 },
    goalie: { level: 'allStar', yOffset: 955 },
  },
  away: {
    center: { level: 'allStar', yOffset: 715 },
    wing: { level: 'allStar', yOffset: 797 },
    defense: { level: 'allStar', yOffset: 877 },
    goalie: { level: 'allStar', yOffset: 955 },
  },
}

const homeX = 270
const awayX = 1140

const levelXPosition: { [k in IAbilityLevel]: number } = {
  rookie: 0,
  veteran: 108,
  allStar: 222,
  hallOfFamer: 342,
  legend: 462,
}

export const titleUpdate = (scene: Phaser.Scene, time: number, delta: number, init: boolean) => {
  if (init) {
    const ha: ITeam[] = ['home', 'away']
    const positions: IPosition[] = ['center', 'wing', 'defense', 'goalie']
    const level: IAbilityLevel[] = ['rookie', 'veteran', 'allStar', 'hallOfFamer', 'legend']

    const updateButtons = () => {
      ha.forEach((side) => {
        positions.forEach((p) => {
          // Get the setting for this side and position (e.g. home wing)
          const setting = settings[side][p]
          if (!setting.buttons) {
            // Create the buttons object (holds the buttons for each level at this position)
            setting.buttons = {}
          }
          level.forEach((l) => {
            const data = setting
            const button = setting.buttons && setting.buttons[l]
            if (!button) {
              // Create the button for this level at this position
              // TS seems to be confused by my object hierarchy here,
              // I've clearly checked the undef condition but it still complains.
              setting.buttons![l] = scene.add
                .circle(
                  (side === 'home' ? homeX : awayX) + levelXPosition[l],
                  data.yOffset,
                  16,
                  settings[side][p].level === l ? 0x0000ff : 0
                )
                .setInteractive()
                .on('pointerdown', () => {
                  settings[side][p].level = l
                  updateButtons()
                })
            } else {
              if (!button) {
                throw new Error(`Settings error. Button not defined for ${side} ${p} ${l}`)
              }
              button.fillColor = settings[side][p].level === l ? 0x0000ff : 0
            }
          })
        })
      })
    }

    updateButtons()

    return
  }

  // When spacebar pressed, close the title screen and create a player and ball for testing
  if (controls.p1Shoot.isDown) {
    scene.add.image(settingsHelpers.fieldWidthMid, settingsHelpers.fieldHeightMid, 'background')

    state.gameState = 'faceOff'
    state.nextStateTransitionTime = scene.time.now + 3000

    titleScreen.destroy()

    state.player1 = createGuy(scene, 'home', 'center', settings['home']['center'].level)
    state.homeTeam.push(state.player1)
    state.player1.setHighlight()
    state.homeGoalie = createGuy(scene, 'home', 'goalie', settings['home']['goalie'].level)
    state.homeTeam.push(state.homeGoalie)
    state.homeTeam.push(createGuy(scene, 'home', 'wing', settings['home']['wing'].level))
    state.homeTeam.push(createGuy(scene, 'home', 'defense', settings['home']['defense'].level))

    state.player2 = createGuy(scene, 'away', 'center', settings['away']['center'].level)
    state.awayTeam.push(state.player2)
    state.player2.setHighlight()
    state.awayGoalie = createGuy(scene, 'away', 'goalie', settings['away']['goalie'].level)
    state.awayTeam.push(state.awayGoalie)
    state.awayTeam.push(createGuy(scene, 'away', 'wing', settings['away']['wing'].level))
    state.awayTeam.push(createGuy(scene, 'away', 'defense', settings['away']['defense'].level))

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
      data.gameObject.grabBall(state.ballGet())
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
