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
      category: team === 'home' ? CollisionCategory.HomeTeam : CollisionCategory.AwayTeam,
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
  canGrabBallNext?: number
  lastMask = 0
  shotPower = 1.3

  grabBall(ball: Ball) {
    ball.grabbed()
    this.ball = ball
  }

  shoot() {
    if (!this.ball) {
      return
    }

    // The typings don't expose the force/veloctiy types we need
    const body = this.body as any

    this.lastMask = body.collisionFilter.mask
    this.canGrabBallNext = this.scene.time.now + 500
    this.setCollidesWith(this.lastMask ^ CollisionCategory.Ball)

    const shootVector =
      body.force.x !== 0 || body.force.y !== 0
        ? new Phaser.Math.Vector2(body.force.x, body.force.y)
        : new Phaser.Math.Vector2(body.velocity.x, body.velocity.y)

    // Add a touch of the player's momentum to the shot
    const playerInertia = new Phaser.Math.Vector2(body.velocity.x, body.velocity.y).scale(0.05)

    // If the player is moving, it will affect the shot
    const finalShotVector = shootVector.normalize().scale(this.shotPower).add(playerInertia)

    this.ball.shootInDirection(finalShotVector)
    this.ball = undefined
  }

  update() {
    const force = 0.2

    // See if player can grab ball again
    if (this.canGrabBallNext && this.canGrabBallNext <= this.scene.time.now) {
      this.canGrabBallNext = undefined
      this.setCollidesWith(this.lastMask)
    }

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
      ((state.player1 === this && controls.pl1Shoot.isDown) || (state.player2 === this && controls.p2Shoot.isDown))
    ) {
      this.shoot()
    }

    if (this.ball) {
      this.ball.setPosition(this.x, this.y)
    }
  }
}
