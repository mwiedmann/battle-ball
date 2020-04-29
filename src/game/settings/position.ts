import { settingsHelpers } from '../consts'
import {
  CollisionCategory,
  HomeGoalieCollisionMask,
  FieldPlayerCollisionMask,
  AwayGoalieCollisionMask,
} from '../types/collision'
import { version } from 'webpack'

export type IPosition = 'goalie' | 'defense' | 'wing' | 'center'

export const sizes = {
  goalie: 32,
  wing: 26,
  center: 32,
  defense: 38,
}

export const positions = {
  home: {
    goalie: {
      startX: settingsHelpers.fieldWidthMid - 600,
      startY: settingsHelpers.fieldHeightMid,
      startWithBallX: settingsHelpers.fieldWidthMid - 600,
      startWithBallY: settingsHelpers.fieldHeightMid,
      offenseX: settingsHelpers.fieldWidthMid - 600,
      offenseY: settingsHelpers.fieldHeightMid,
      defenseX: settingsHelpers.fieldWidthMid - 600,
      defenseY: settingsHelpers.fieldHeightMid,
      collisionCategory: CollisionCategory.HomeGoalie,
      collisionMask: HomeGoalieCollisionMask,
    },
    wing: {
      startX: settingsHelpers.fieldWidthMid - 150,
      startY: settingsHelpers.fieldHeightMid - 150,
      startWithBallX: settingsHelpers.fieldWidthMid - 100,
      startWithBallY: settingsHelpers.fieldHeightMid - 100,
      offenseX: settingsHelpers.fieldWidthMid + 400,
      offenseY: settingsHelpers.fieldHeightMid - 100,
      defenseX: settingsHelpers.fieldWidthMid - 150,
      defenseY: settingsHelpers.fieldHeightMid - 100,
      collisionCategory: CollisionCategory.HomeTeam,
      collisionMask: FieldPlayerCollisionMask,
    },
    center: {
      startX: settingsHelpers.fieldWidthMid - 150,
      startY: settingsHelpers.fieldHeightMid + 150,
      startWithBallX: settingsHelpers.fieldWidthMid - 40,
      startWithBallY: settingsHelpers.fieldHeightMid,
      offenseX: settingsHelpers.fieldWidthMid + 400,
      offenseY: settingsHelpers.fieldHeightMid + 100,
      defenseX: settingsHelpers.fieldWidthMid - 150,
      defenseY: settingsHelpers.fieldHeightMid + 100,
      collisionCategory: CollisionCategory.HomeTeam,
      collisionMask: FieldPlayerCollisionMask,
    },
    defense: {
      startX: settingsHelpers.fieldWidthMid - 400,
      startY: settingsHelpers.fieldHeightMid,
      startWithBallX: settingsHelpers.fieldWidthMid - 300,
      startWithBallY: settingsHelpers.fieldHeightMid,
      offenseX: settingsHelpers.fieldWidthMid + 50,
      offenseY: settingsHelpers.fieldHeightMid,
      defenseX: settingsHelpers.fieldWidthMid - 400,
      defenseY: settingsHelpers.fieldHeightMid,
      collisionCategory: CollisionCategory.HomeTeam,
      collisionMask: FieldPlayerCollisionMask,
    },
  },
  away: {
    goalie: {
      startX: settingsHelpers.fieldWidthMid + 600,
      startY: settingsHelpers.fieldHeightMid,
      startWithBallX: settingsHelpers.fieldWidthMid + 600,
      startWithBallY: settingsHelpers.fieldHeightMid,
      offenseX: settingsHelpers.fieldWidthMid + 600,
      offenseY: settingsHelpers.fieldHeightMid,
      defenseX: settingsHelpers.fieldWidthMid + 600,
      defenseY: settingsHelpers.fieldHeightMid,
      collisionCategory: CollisionCategory.AwayGoalie,
      collisionMask: AwayGoalieCollisionMask,
    },
    wing: {
      startX: settingsHelpers.fieldWidthMid + 150,
      startY: settingsHelpers.fieldHeightMid + 150,
      startWithBallX: settingsHelpers.fieldWidthMid + 100,
      startWithBallY: settingsHelpers.fieldHeightMid + 100,
      offenseX: settingsHelpers.fieldWidthMid - 400,
      offenseY: settingsHelpers.fieldHeightMid + 100,
      defenseX: settingsHelpers.fieldWidthMid + 150,
      defenseY: settingsHelpers.fieldHeightMid + 100,
      collisionCategory: CollisionCategory.AwayTeam,
      collisionMask: FieldPlayerCollisionMask,
    },
    center: {
      startX: settingsHelpers.fieldWidthMid + 150,
      startY: settingsHelpers.fieldHeightMid - 150,
      startWithBallX: settingsHelpers.fieldWidthMid + 40,
      startWithBallY: settingsHelpers.fieldHeightMid,
      offenseX: settingsHelpers.fieldWidthMid - 400,
      offenseY: settingsHelpers.fieldHeightMid - 100,
      defenseX: settingsHelpers.fieldWidthMid + 150,
      defenseY: settingsHelpers.fieldHeightMid - 100,
      collisionCategory: CollisionCategory.AwayTeam,
      collisionMask: FieldPlayerCollisionMask,
    },
    defense: {
      startX: settingsHelpers.fieldWidthMid + 400,
      startY: settingsHelpers.fieldHeightMid,
      startWithBallX: settingsHelpers.fieldWidthMid + 300,
      startWithBallY: settingsHelpers.fieldHeightMid,
      offenseX: settingsHelpers.fieldWidthMid - 50,
      offenseY: settingsHelpers.fieldHeightMid,
      defenseX: settingsHelpers.fieldWidthMid + 400,
      defenseY: settingsHelpers.fieldHeightMid,
      collisionCategory: CollisionCategory.AwayTeam,
      collisionMask: FieldPlayerCollisionMask,
    },
  },
}

// wing: fast and a great shot, but not as tough and don't hit as hard
// centers: slower than wings and don't shoot as well, but tougher and hit harder
// defense: slowest, worst shot, and modium toughness, but hit hardest
// goalies: Good toughness so they can hold onto the ball but low otherwise
// TODO: Goalie also need ability to stay in right spot to block shots
export const abilities = {
  goalie: {
    rookie: { toughness: 50, hitting: 0, speed: 0.18, shotPower: 1.3 },
    veteran: { toughness: 63, hitting: 0, speed: 0.18, shotPower: 1.3 },
    allStar: { toughness: 75, hitting: 0, speed: 0.18, shotPower: 1.3 },
    hallOfFamer: { toughness: 87, hitting: 0, speed: 0.18, shotPower: 1.3 },
    legend: { toughness: 99, hitting: 0, speed: 0.18, shotPower: 1.3 },
  },
  wing: {
    rookie: { toughness: 35, hitting: 0, speed: 0.17, shotPower: 1.25 },
    veteran: { toughness: 47, hitting: 3, speed: 0.175, shotPower: 1.35 },
    allStar: { toughness: 60, hitting: 6, speed: 0.18, shotPower: 1.45 },
    hallOfFamer: { toughness: 72, hitting: 10, speed: 0.185, shotPower: 1.55 },
    legend: { toughness: 85, hitting: 13, speed: 0.19, shotPower: 1.65 },
  },
  center: {
    rookie: { toughness: 45, hitting: 4, speed: 0.18, shotPower: 1.1 },
    veteran: { toughness: 58, hitting: 9, speed: 0.19, shotPower: 1.2 },
    allStar: { toughness: 70, hitting: 14, speed: 0.2, shotPower: 1.3 },
    hallOfFamer: { toughness: 82, hitting: 19, speed: 0.21, shotPower: 1.4 },
    legend: { toughness: 95, hitting: 25, speed: 0.22, shotPower: 1.5 },
  },
  defense: {
    rookie: { toughness: 55, hitting: 10, speed: 0.17, shotPower: 0.8 },
    veteran: { toughness: 68, hitting: 15, speed: 0.18, shotPower: 0.9 },
    allStar: { toughness: 80, hitting: 20, speed: 0.19, shotPower: 1 },
    hallOfFamer: { toughness: 92, hitting: 25, speed: 0.2, shotPower: 1.2 },
    legend: { toughness: 97, hitting: 30, speed: 0.21, shotPower: 1.3 },
  },
}

export type TAbilityLevel = 'rookie' | 'veteran' | 'allStar' | 'hallOfFamer' | 'legend'
