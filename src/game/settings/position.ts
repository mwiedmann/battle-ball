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

export const goaltendingAbilities = {
  rookie: {
    reactionTime: 400,
    accuracy: 100,
  },
  veteran: {
    reactionTime: 300,
    accuracy: 75,
  },
  allStar: {
    reactionTime: 200,
    accuracy: 50,
  },
  hallOfFamer: {
    reactionTime: 100,
    accuracy: 25,
  },
  legend: {
    reactionTime: 50,
    accuracy: 10,
  },
}

// wing: fast and a great shot, but not as tough and don't hit as hard
// centers: slower than wings and don't shoot as well, but tougher and hit harder
// defense: slowest, worst shot, and modium toughness, but hit hardest
// goalies: Good toughness so they can hold onto the ball but low otherwise
// TODO: Goalie also need ability to stay in right spot to block shots
export const abilities = {
  goalie: {
    rookie: {
      toughness: 50,
      hitting: 0,
      speed: 0.19,
      shotPower: 0.7,
      recovery: 1000,
    },
    veteran: {
      toughness: 63,
      hitting: 0,
      speed: 0.195,
      shotPower: 0.8,
      recovery: 800,
    },
    allStar: {
      toughness: 75,
      hitting: 0,
      speed: 0.2,
      shotPower: 0.9,
      recovery: 600,
    },
    hallOfFamer: {
      toughness: 87,
      hitting: 0,
      speed: 0.205,
      shotPower: 1,
      recovery: 500,
    },
    legend: {
      toughness: 99,
      hitting: 0,
      speed: 0.21,
      shotPower: 1.1,
      recovery: 500,
    },
  },
  wing: {
    rookie: { toughness: 35, hitting: 0, speed: 0.155, shotPower: 1.2, recovery: 3000 },
    veteran: { toughness: 47, hitting: 3, speed: 0.16, shotPower: 1.3, recovery: 2750 },
    allStar: { toughness: 60, hitting: 6, speed: 0.165, shotPower: 1.4, recovery: 2500 },
    hallOfFamer: { toughness: 72, hitting: 10, speed: 0.17, shotPower: 1.5, recovery: 2250 },
    legend: { toughness: 85, hitting: 13, speed: 0.175, shotPower: 1.6, recovery: 2000 },
  },
  center: {
    rookie: { toughness: 45, hitting: 4, speed: 0.18, shotPower: 1.1, recovery: 2000 },
    veteran: { toughness: 58, hitting: 9, speed: 0.19, shotPower: 1.2, recovery: 1750 },
    allStar: { toughness: 70, hitting: 14, speed: 0.2, shotPower: 1.3, recovery: 1500 },
    hallOfFamer: { toughness: 82, hitting: 19, speed: 0.21, shotPower: 1.4, recovery: 1250 },
    legend: { toughness: 95, hitting: 25, speed: 0.22, shotPower: 1.5, recovery: 1000 },
  },
  defense: {
    rookie: { toughness: 65, hitting: 25, speed: 0.2, shotPower: 0.8, recovery: 1500 },
    veteran: { toughness: 78, hitting: 30, speed: 0.21, shotPower: 0.9, recovery: 1250 },
    allStar: { toughness: 88, hitting: 35, speed: 0.22, shotPower: 1, recovery: 1000 },
    hallOfFamer: { toughness: 94, hitting: 40, speed: 0.23, shotPower: 1.2, recovery: 750 },
    legend: { toughness: 98, hitting: 45, speed: 0.24, shotPower: 1.3, recovery: 500 },
  },
}

export type IAbilityLevel = 'rookie' | 'veteran' | 'allStar' | 'hallOfFamer' | 'legend'
