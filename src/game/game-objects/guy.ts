import { gameSettings, settingsHelpers } from '../consts'
import { controls } from '../game-init'
import { Ball } from './ball'
import { state } from '../states'
import { ITeam } from '../types'
import { CollisionCategory, FieldPlayerCollisionMask } from '../types/collision'

const circleRadius = 32

export const createGuy = (scene: Phaser.Scene, team: ITeam) => {
  const guy = new Guy(scene.matter.world, 700, settingsHelpers.fieldHeightMid, `${team}-player`, team, undefined, {
    circleRadius,
    friction: 0.03,
    frictionAir: 0.03,
    frictionStatic: 0,
    density: 0.065,
    collisionFilter: {
      mask: FieldPlayerCollisionMask,
    },
  })

  guy.setBounce(1)

  scene.add.existing(guy)

  return guy
}

export class Guy extends Phaser.Physics.Matter.Image {
  constructor(
    world: Phaser.Physics.Matter.World,
    x: number,
    y: number,
    texture: string,
    public team: ITeam,
    frame?: string | integer,
    options?: Phaser.Types.Physics.Matter.MatterBodyConfig
  ) {
    super(world, x, y, texture, frame, options)
  }

  ball?: Ball

  grabBall(ball: Ball) {
    ball.grabbed()
    this.ball = ball
  }

  update() {
    const force = 0.2

    if (
      (state.player1 === this && controls.cursors.left?.isDown) ||
      (state.player2 === this && controls.p2Left.isDown)
    ) {
      this.applyForce(new Phaser.Math.Vector2(-force, 0))
    }

    if (
      (state.player1 === this && controls.cursors.right?.isDown) ||
      (state.player2 === this && controls.p2Right.isDown)
    ) {
      this.applyForce(new Phaser.Math.Vector2(force, 0))
    }

    if ((state.player1 === this && controls.cursors.up?.isDown) || (state.player2 === this && controls.p2Up.isDown)) {
      this.applyForce(new Phaser.Math.Vector2(0, -force))
    }

    if (
      (state.player1 === this && controls.cursors.down?.isDown) ||
      (state.player2 === this && controls.p2Down.isDown)
    ) {
      this.applyForce(new Phaser.Math.Vector2(0, force))
    }

    if (
      this.ball &&
      ((state.player1 === this && controls.spacebar.isDown) || (state.player2 === this && controls.p2Shoot.isDown))
    ) {
      // The typings don't expose the force/veloctiy types we need
      const body = this.body as any

      // this.ball.shootAtTarget(state.goal!, circleRadius)
      // this.ball.shootInDirection(new Phaser.Math.Vector2(body.velocity.x, body.velocity.y), circleRadius)
      const shootVector =
        body.force.x !== 0 || body.force.y !== 0
          ? new Phaser.Math.Vector2(body.force.x, body.force.y)
          : new Phaser.Math.Vector2(body.velocity.x, body.velocity.y)
      this.ball.shootInDirection(shootVector, circleRadius)
      this.ball = undefined
    }

    if (this.ball) {
      this.ball.setPosition(this.x, this.y)
    }
  }
}
