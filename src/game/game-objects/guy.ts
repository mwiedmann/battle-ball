import { gameSettings, settingsHelpers } from '../consts'
import { controls } from '../game-init'
import { Ball } from './ball'
import { state } from '../states'
import { ITeam } from '../types'
import { CollisionCategory, FieldPlayerCollisionMask } from '../types/collision'
import { IPosition, positions } from '../settings/position'

const circleRadius = 32

export const createGuy = (scene: Phaser.Scene, team: ITeam, position: IPosition) => {
  const guy = new Guy(
    scene.matter.world,
    positions[team][position].startX,
    positions[team][position].startY,
    `${team}-player`,
    team,
    position,
    undefined,
    {
      circleRadius,
      friction: 0.03,
      frictionAir: 0.03,
      frictionStatic: 0,
      density: 0.065,
      collisionFilter: {
        mask: positions[team][position].collisionMask,
        category: positions[team][position].collisionCategory,
      },
    }
  )

  guy.startingPosition()

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
    public position: IPosition,
    frame?: string | integer,
    options?: Phaser.Types.Physics.Matter.MatterBodyConfig
  ) {
    super(world, x, y, texture, frame, options)

    this.startX = x
    this.startY = y
  }

  startX: number
  startY: number

  ball?: Ball
  canGrabBallNext?: number
  lastMask = 0
  shotPower = 1.3
  timeCaughtBall?: number

  goToPositionX = 0
  goToPositionY = 0
  goToPositionDefense = true
  goToPositionTime = 0

  grabBall(ball: Ball) {
    // Guy can only grab the ball during the 'game' state
    if (state.gameState === 'game') {
      this.setActivePlayer()
      ball.grabbed()
      this.ball = ball

      this.timeCaughtBall = this.scene.time.now
    }
  }

  setActivePlayer() {
    if (this.team === 'home') {
      state.player1 = this
    } else {
      state.player2 = this
    }
  }

  startingPosition() {
    this.setPosition(this.startX, this.startY)
    this.setVelocity(0, 0)
    this.setAwake()

    if (this.canGrabBallNext) {
      this.canGrabBallNext = undefined
      this.setCollidesWith(this.lastMask)
    }
  }

  moveToStartingPosition() {
    this.moveToPosition(this.startX, this.startY)
  }

  moveToPosition(moveToX: number, moveToY: number) {
    if (Phaser.Math.Distance.Between(moveToX, moveToY, this.x, this.y) > 5) {
      this.applyForce(
        new Phaser.Math.Vector2(moveToX, moveToY)
          .subtract(new Phaser.Math.Vector2(this.x, this.y))
          .normalize()
          .scale(0.25)
      )
    }
  }
  dropBall() {
    // The typings don't expose the force/veloctiy types we need
    const body = this.body as any

    this.lastMask = body.collisionFilter.mask
    this.canGrabBallNext = this.scene.time.now + 500
    this.setCollidesWith(this.lastMask ^ CollisionCategory.Ball)
  }

  shoot() {
    if (!this.ball) {
      return
    }

    this.dropBall()

    // The typings don't expose the force/veloctiy types we need
    const body = this.body as any

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

    // If this is the goalie, swtich control to another guy
    if (this.position === 'goalie') {
      if (this.team === 'home') {
        state.player1 = state.homeTeam.find((p) => p.position !== 'goalie')
      } else {
        state.player2 = state.awayTeam.find((p) => p.position !== 'goalie')
      }
    }
  }

  update() {
    const force = 0.2

    // See if player can grab ball again
    if (this.canGrabBallNext && this.canGrabBallNext <= this.scene.time.now) {
      this.canGrabBallNext = undefined
      this.setCollidesWith(this.lastMask)
    }

    if (this.ball) {
      this.ball.setPosition(this.x, this.y)
    }

    // See if this guy is ai controlled atm
    if (
      (this.team === 'home' && (state.player1AI || state.player1 !== this)) ||
      (this.team === 'away' && (state.player2AI || state.player2 !== this))
    ) {
      return this.ai()
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
  }
  ai() {
    if (this.position === 'goalie') {
      const goal = this.team === 'home' ? state.homeGoal : state.awayGoal

      // As goalie, try to position between the ball and the goal
      let guardPoint = new Phaser.Geom.Point()

      const hasGuardSpot = Phaser.Geom.Intersects.LineToLine(
        new Phaser.Geom.Line(state.ball?.x, state.ball?.y, goal?.x, goal?.y),
        new Phaser.Geom.Line(this.startX, this.startY - 200, this.startX, this.startY + 200),
        guardPoint
      )

      // if (this.team === 'away') {
      //   state.debugImage?.setPosition(guardPoint.x, guardPoint.y)
      // }

      if (hasGuardSpot) {
        this.moveToPosition(guardPoint.x, guardPoint.y)
      } else {
        // If the ball is being held behind the goal,
        // The goalie stays on his line matches the Y position
        const goToY =
          state.ball!.y > this.startY + 200
            ? this.startY + 200
            : state.ball!.y < this.startY - 200
            ? this.startY - 200
            : state.ball!.y
        this.moveToPosition(this.startX, goToY)
      }
    } else {
      // If on defense (other team has ball) and the ball is 'close", just move to the ball
      // if (
      //   ((state.player1?.ball && this.team === 'away') ||
      //     (state.player2?.ball && this.team === 'home') ||
      //     (!state.player1?.ball && !state.player2?.ball)) &&
      //   Phaser.Math.Distance.Between(state.ball!.x, state.ball!.y, this.x, this.y) < 300
      // ) {
      //   this.moveToPosition(state.ball!.x, state.ball!.y)
      // } else {
      //   // Just move back ot the starting position for now
      //   this.moveToStartingPosition()
      // }

      const positionData = positions[this.team][this.position]

      // AI will move to their designated postion with some random variance
      // The variance will change about every 2 seconds so the AI doesn't just stay still
      if (state.onOffense(this.team)) {
        if (this.goToPositionDefense || this.goToPositionTime <= this.scene.time.now) {
          this.goToPositionX = Phaser.Math.RND.integerInRange(positionData.offenseX - 75, positionData.offenseX + 75)
          this.goToPositionY = Phaser.Math.RND.integerInRange(positionData.offenseY - 75, positionData.offenseY + 75)
          this.goToPositionTime = this.scene.time.now + Phaser.Math.RND.integerInRange(1750, 2250)
        }
      } else {
        if (!this.goToPositionDefense || this.goToPositionTime <= this.scene.time.now) {
          this.goToPositionX = Phaser.Math.RND.integerInRange(positionData.defenseX - 75, positionData.defenseX + 75)
          this.goToPositionY = Phaser.Math.RND.integerInRange(positionData.defenseY - 75, positionData.defenseY + 75)
          this.goToPositionTime = this.scene.time.now + Phaser.Math.RND.integerInRange(1750, 2250)
        }
      }

      this.moveToPosition(this.goToPositionX, this.goToPositionY)
    }

    // The AI will throw the ball to a teammate after a few seconds
    if (this.ball && this.timeCaughtBall && this.timeCaughtBall + 2000 <= this.scene.time.now) {
      const throwTo = Phaser.Math.RND.pick(state.getTeammates(this))
      this.dropBall()
      this.ball.shootAtTarget(throwTo)
      this.ball = undefined
      this.timeCaughtBall = undefined
    }
  }
}
