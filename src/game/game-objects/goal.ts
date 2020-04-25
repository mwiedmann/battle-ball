import { state } from '../states'
import { settingsHelpers } from '../consts'
import { CollisionCategory } from '../types/collision'
import { ITeam } from '../types'

const goalLocations = {
  home: {
    goal: { x: 245, rotation: 0 },
    restrictedArea: { x: 303 },
    scoringArea: { x: 265 },
  },
  away: {
    goal: { x: 1680, rotation: Phaser.Math.PI2 / 2 },
    restrictedArea: { x: 1621 },
    scoringArea: { x: 1660 },
  },
}

export const createGoal = (scene: Phaser.Scene, team: ITeam) => {
  const goalShape = scene.cache.json.get('goal')
  const goal = scene.matter.add.image(goalLocations[team].goal.x, settingsHelpers.fieldHeightMid, 'goal', undefined, {
    shape: goalShape.goal,
    isStatic: true,
  } as any)

  goal.setRotation(goalLocations[team].goal.rotation)

  // Restricted area around goal
  scene.matter.add.rectangle(goalLocations[team].restrictedArea.x, settingsHelpers.fieldHeightMid, 256, 384, {
    isStatic: true,
    collisionFilter: {
      category: team === 'home' ? CollisionCategory.GoalRestrictedAreaHome : CollisionCategory.GoalRestrictedAreaAway,
    },
  })

  // Area inside goal that triggers a goal scored
  const scoreArea = scene.matter.add.rectangle(
    goalLocations[team].scoringArea.x,
    settingsHelpers.fieldHeightMid,
    40,
    220,
    {
      label: `${team}-scoreArea`,
      isStatic: true,
      collisionFilter: {
        category: team === 'home' ? CollisionCategory.GoalScoreAreaHome : CollisionCategory.GoalScoreAreaAway,
      },
    }
  )

  if (team === 'home') {
    state.homeScoreArea = scoreArea
  } else {
    state.awayScoreArea = scoreArea
  }

  return goal
}
