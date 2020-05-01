import { settingsHelpers, gameSettings } from '../consts'
import { controls, titleScreen } from '../game-init'
import { state, constructState } from '.'
import { IAbilityLevel, IPosition } from '../settings/position'
import { ITeam } from '../types'
import { gameState } from '../update'

export const teamConfigSettings: {
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

    // Create the array of clickable areas on the player/level selection screen
    const updateButtons = () => {
      ha.forEach((side) => {
        positions.forEach((p) => {
          // Get the setting for this side and position (e.g. home wing)
          const setting = teamConfigSettings[side][p]
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
                  teamConfigSettings[side][p].level === l ? 0x0000ff : 0
                )
                .setInteractive()
                .on('pointerdown', () => {
                  teamConfigSettings[side][p].level = l
                  updateButtons()
                })
            } else {
              if (!button) {
                throw new Error(`Settings error. Button not defined for ${side} ${p} ${l}`)
              }
              button.fillColor = teamConfigSettings[side][p].level === l ? 0x0000ff : 0
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
    titleScreen.destroy()

    constructState(scene)

    gameState.phase = 'faceOff'
    gameState.nextStateTransitionTime = scene.time.now + 3000

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
