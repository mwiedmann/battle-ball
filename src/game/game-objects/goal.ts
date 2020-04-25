import { state } from '../states'
import { settingsHelpers } from '../consts'
import { CollisionCategory } from '../types/collision'
import { ITeam } from '../types'

const goalLocations = {
  home: {
    goal: { x: 245, rotation: 0 },
    restrictedArea: { x: 303 },
  },
  away: {
    goal: { x: 1680, rotation: Phaser.Math.PI2 / 2 },
    restrictedArea: { x: 1621 },
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

  return goal
}
