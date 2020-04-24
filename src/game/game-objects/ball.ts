import { settingsHelpers } from '../consts'
import { state } from '../states'
import { controls } from '../game-init'
import { CollisionCategory, BallCollisionMask } from '../types/collision'

const circleRadius = 8
const dropBuffer = 4

export const createBall = (scene: Phaser.Scene) => {
  const ball = new Ball(scene.matter.world, 600, settingsHelpers.fieldHeightMid, 'ball', undefined, {
    circleRadius,
    friction: 0.005,
    frictionAir: 0.005,
    frictionStatic: 0.01,
    density: 0.1,
    restitution: 0.7,
  })

  scene.add.existing(ball)

  return ball
}

export class Ball extends Phaser.Physics.Matter.Image {
  constructor(
    world: Phaser.Physics.Matter.World,
    x: number,
    y: number,
    texture: string,
    frame?: string | integer,
    options?: Phaser.Types.Physics.Matter.MatterBodyConfig
  ) {
    super(world, x, y, texture, frame, options)
  }

  update() {
    // Restrieve the ball if not already holding it
    if (controls.retrieveBall.isDown && !state.player1?.ball) {
      this.shootAtTarget(state.player1!, circleRadius)
    }
  }

  grabbed() {
    this.setCollidesWith(0)
  }

  dropped(direction: Phaser.Math.Vector2, distance: number) {
    const dropVector = direction.clone().scale(distance)
    this.setPosition(this.x + dropVector.x, this.y + dropVector.y)
    this.setCollidesWith(BallCollisionMask)
  }

  shootAtTarget(target: Phaser.Types.Math.Vector2Like, dropDistance: number) {
    const fullDropDistance = dropDistance + circleRadius + dropBuffer
    const shootVector = new Phaser.Math.Vector2(target).subtract(new Phaser.Math.Vector2(state.ball)).normalize()

    this.dropped(shootVector, fullDropDistance)
    this.setVelocity(0, 0)
    this.applyForce(shootVector)
  }

  shootInDirection(direction: Phaser.Math.Vector2, dropDistance: number) {
    const fullDropDistance = dropDistance + circleRadius + dropBuffer
    const shootVector = direction.normalize()

    this.dropped(shootVector, fullDropDistance)
    this.setVelocity(0, 0)
    this.applyForce(shootVector)
  }
}
