import { state } from '../states'
import { settingsHelpers } from '../consts'
import { CollisionCategory } from '../types/collision'
import { ITeam } from '../types'

export const createGoal = (scene: Phaser.Scene, team: ITeam) => {
  const goalShape = scene.cache.json.get('goal')
  const goal = scene.matter.add.image(245, settingsHelpers.fieldHeightMid, 'goal', undefined, {
    shape: goalShape.goal,
    isStatic: true,
  } as any)

  // Restricted area around goal
  scene.matter.add.rectangle(303, settingsHelpers.fieldHeightMid, 256, 384, {
    isStatic: true,
    collisionFilter: {
      category: team === 'home' ? CollisionCategory.GoalRestrictedAreaHome : CollisionCategory.GoalRestrictedAreaAway,
    },
  })

  return goal
}
