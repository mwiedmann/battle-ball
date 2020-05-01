import { state } from '../states'
import { settingsHelpers } from '../consts'
import { CollisionCategory } from '../types/collision'
import { ITeam } from '../types'

const goalLocations = {
  home: {
    goal: { x: 245, rotation: 0 },
    restrictedArea: { x: 325 },
    scoringArea: { x: 265 },
  },
  away: {
    goal: { x: 1680, rotation: Phaser.Math.PI2 / 2 },
    restrictedArea: { x: 1600 },
    scoringArea: { x: 1660 },
  },
}

export const createGoal = (scene: Phaser.Scene, team: ITeam) => {
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

  const goalShape = scene.cache.json.get('goal')
  const goal = new Goal(
    scene.matter.world,
    goalLocations[team].goal.x,
    settingsHelpers.fieldHeightMid,
    'goal',
    scoreArea,
    undefined,
    {
      shape: goalShape.goal,
      isStatic: true,
    } as any
  )

  scene.add.existing(goal)

  goal.setRotation(goalLocations[team].goal.rotation)

  // Restricted area around goal
  scene.matter.add.rectangle(goalLocations[team].restrictedArea.x, settingsHelpers.fieldHeightMid, 212, 384, {
    isStatic: true,
    collisionFilter: {
      category: team === 'home' ? CollisionCategory.GoalRestrictedAreaHome : CollisionCategory.GoalRestrictedAreaAway,
    },
  })

  return goal
}

export class Goal extends Phaser.Physics.Matter.Image {
  constructor(
    world: Phaser.Physics.Matter.World,
    x: number,
    y: number,
    texture: string,
    public scoreArea: MatterJS.BodyType,
    frame?: string | integer,
    options?: Phaser.Types.Physics.Matter.MatterBodyConfig
  ) {
    super(world, x, y, texture, frame, options)
  }
}
