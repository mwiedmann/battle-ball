import { gameSettings, settingsHelpers } from '../consts'
import { controls } from '../game-init'
import { Ball } from './ball'
import { state } from '../states'
import { ITeam } from '../types'
import { CollisionCategory, FieldPlayerCollisionMask } from '../types/collision'
import { IPosition, positions, abilities, TAbilityLevel, sizes } from '../settings/position'
import { closestNonGoalie } from '../helpers/guy-helper'

export interface IGuyConfig {
  level: TAbilityLevel
  team: ITeam
  position: IPosition
}

export const createGuy = (scene: Phaser.Scene, team: ITeam, position: IPosition, level: TAbilityLevel) => {
  const positionData = positions[team][position]
  const circleRadius = sizes[position]

  const guy = new Guy(
    scene.matter.world,
    positionData.startX,
    positionData.startY,
    `${team}-${position}`,
    team,
    position,
    level,
    0,
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

export class Guy extends Phaser.Physics.Matter.Sprite {
  constructor(
    world: Phaser.Physics.Matter.World,
    x: number,
    y: number,
    texture: string,
    public team: ITeam,
    public position: IPosition,
    public level: TAbilityLevel,
    frame: string | integer,
    options: Phaser.Types.Physics.Matter.MatterBodyConfig
  ) {
    super(world, x, y, texture, frame, options)

    this.startX = x
    this.startY = y
    this.guyRadius = options.circleRadius!

    const ability = abilities[position][level]

    this.toughness = ability.toughness
    this.hitting = ability.hitting
    this.speed = ability.speed
    this.shotPower = ability.shotPower
  }

  startX: number
  startY: number
  guyRadius: number

  ball?: Ball
  canGrabBallNext?: number
  stunnedTime?: number
  lastMask = 0

  timeToNextActionWithBall?: number

  goToPositionX = 0
  goToPositionY = 0
  goToPositionDefense = true
  goToPositionTime = 0

  fumbleNextUpdate = false

  toughness: number
  hitting: number
  speed: number
  shotPower: number

  grabBall(ball: Ball) {
    // Guy can only grab the ball during the 'game' state
    if (state.gameState === 'game') {
      this.setActivePlayer()
      ball.grabbed()
      this.ball = ball

      // If the goalie catches the ball, have him go up or down briefly and pass it out.
      if (this.position === 'goalie') {
        this.goToPositionX = this.x
        this.goToPositionY = Phaser.Math.RND.pick([this.y - 150, this.y + 150])

        this.timeToNextActionWithBall = this.scene.time.now + Phaser.Math.RND.between(500, 1000)
      } else {
        this.timeToNextActionWithBall = this.scene.time.now + Phaser.Math.RND.between(1000, 3000)
      }
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

    this.stunnedTime = undefined
  }

  moveToStartingPosition() {
    this.moveToPosition(this.startX, this.startY, 0.3)
  }

  moveToPosition(moveToX: number, moveToY: number, force?: number) {
    if (Phaser.Math.Distance.Between(moveToX, moveToY, this.x, this.y) > 5) {
      this.applyForce(
        new Phaser.Math.Vector2(moveToX, moveToY)
          .subtract(new Phaser.Math.Vector2(this.x, this.y))
          .normalize()
          .scale(force || this.speed)
      )
    }
  }

  gotHit(otherGuy: Guy) {
    // Random number + the other guys hitting needs to be this guys toughness to make him fumble
    if (Phaser.Math.RND.integerInRange(0, 100) + otherGuy.hitting > this.toughness) {
      this.fumbleNextUpdate = true
    }
  }

  fumbleBall() {
    this.fumbleNextUpdate = false

    if (this.ball) {
      this.ball.shootInDirection(
        new Phaser.Math.Vector2(Phaser.Math.RND.normal(), Phaser.Math.RND.normal()).normalize().scale(0.3)
      )
      this.dropBall(1000)
      this.stunnedTime = this.scene.time.now + 1000
    }
  }

  dropBall(grabBallTime?: number) {
    // The typings don't expose the force/veloctiy types we need
    const body = this.body as any

    this.lastMask = body.collisionFilter.mask
    this.canGrabBallNext = this.scene.time.now + (grabBallTime || 500)
    this.setCollidesWith(this.lastMask ^ CollisionCategory.Ball)

    this.ball = undefined
  }

  shoot() {
    if (!this.ball) {
      return
    }

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

    // If this is the goalie, swtich control to another guy
    if (this.position === 'goalie') {
      if (this.team === 'home') {
        state.player1 = state.homeTeam.find((p) => p.position !== 'goalie')
      } else {
        state.player2 = state.awayTeam.find((p) => p.position !== 'goalie')
      }
    }

    this.dropBall()
  }

  pass(left: boolean, right: boolean, up: boolean, down: boolean, mustBeOpen: boolean): boolean {
    if (!this.ball) {
      return false
    }

    const homePass = (guy: Guy) =>
      (!left || guy.x <= this.x) &&
      (!right || guy.x >= this.x) &&
      (!up || (guy.x >= this.x && guy.y <= this.y)) &&
      (!down || (guy.x >= this.x && guy.y >= this.y))

    const awayPass = (guy: Guy) =>
      (!left || guy.x <= this.x) &&
      (!right || guy.x >= this.x) &&
      (!up || (guy.x <= this.x && guy.y <= this.y)) &&
      (!down || (guy.x <= this.x && guy.y >= this.y))

    // First, try to find a teammate in the direction the player is aiming
    let closestTeammate = closestNonGoalie(
      state.getTeammates(this),
      this.x,
      this.y,
      this.team === 'home' ? homePass : awayPass
    )

    // If no teammates in that exact direction, pass to the closest
    if (!closestTeammate) {
      closestTeammate = closestNonGoalie(state.getTeammates(this), this.x, this.y)
    }

    if (closestTeammate) {
      // If the teammate must be open, then make sure the other team can't block this pass
      if (mustBeOpen) {
        const line = new Phaser.Geom.Line(this.x, this.y, closestTeammate.x, closestTeammate.y)
        const otherTeam = this.team === 'home' ? state.awayTeam : state.homeTeam

        const canBlock = otherTeam.find((p) => {
          const circle = new Phaser.Geom.Circle(p.x, p.y, this.guyRadius * 1.25)
          return Phaser.Geom.Intersects.LineToCircle(line, circle)
        })

        if (!canBlock) {
          this.ball.shootAtTarget(closestTeammate)
          this.dropBall()
          return true
        } else {
          return false
        }
      } else {
        this.ball.shootAtTarget(closestTeammate)
        this.dropBall()
        return true
      }
    }
    return false
  }

  setHighlight() {
    // Use the highlighted player for the active guys
    this.setFrame(
      this.stunnedTime
        ? 2
        : (!state.player1AI && state.player1 === this) || (!state.player2AI && state.player2 == this)
        ? 1
        : 0
    )
  }

  update() {
    const force = 0.2

    // Check player controls
    // TODO: Analog controls with joytick
    const left =
      (state.player1 === this && controls.cursors.left?.isDown) || (state.player2 === this && controls.p2Left.isDown)
    const right =
      (state.player1 === this && controls.cursors.right?.isDown) || (state.player2 === this && controls.p2Right.isDown)
    const up =
      (state.player1 === this && controls.cursors.up?.isDown) || (state.player2 === this && controls.p2Up.isDown)
    const down =
      (state.player1 === this && controls.cursors.down?.isDown) || (state.player2 === this && controls.p2Down.isDown)

    this.setHighlight()

    if (this.fumbleNextUpdate) {
      this.fumbleBall()
    }

    // See if player can grab ball again
    if (this.canGrabBallNext && this.canGrabBallNext <= this.scene.time.now) {
      this.canGrabBallNext = undefined
      this.setCollidesWith(this.lastMask)
    }

    if (this.ball) {
      this.ball.setPosition(this.x, this.y)
    }

    // Pass or switch to player closest to the ball
    if ((state.player1 === this && controls.p1Pass.isDown) || (state.player2 === this && controls.p2Pass.isDown)) {
      if (this.ball) {
        this.pass(left, right, up, down, false)
      } else {
        if (this.team === 'home' && state.homeClosestToBall) {
          state.player1 = state.homeClosestToBall
        }

        if (this.team === 'away' && state.awayClosestToBall) {
          state.player2 = state.awayClosestToBall
        }
      }
    }

    // Stunned player cannot move
    if (this.stunnedTime) {
      if (this.stunnedTime <= this.scene.time.now) {
        this.stunnedTime = undefined
      }
      return
    }

    // See if this guy is ai controlled atm
    if (
      (this.team === 'home' && (state.player1AI || state.player1 !== this)) ||
      (this.team === 'away' && (state.player2AI || state.player2 !== this))
    ) {
      return this.ai()
    }

    if (left) {
      this.applyForce(new Phaser.Math.Vector2(-force, 0))
    }

    if (right) {
      this.applyForce(new Phaser.Math.Vector2(force, 0))
    }

    if (up) {
      this.applyForce(new Phaser.Math.Vector2(0, -force))
    }

    if (down) {
      this.applyForce(new Phaser.Math.Vector2(0, force))
    }

    if (
      this.ball &&
      ((state.player1 === this && controls.p1Shoot.isDown) || (state.player2 === this && controls.p2Shoot.isDown))
    ) {
      this.shoot()
    }
  }

  ai() {
    let force = this.speed

    if (this.position === 'goalie') {
      if (this.ball) {
        // The AI will throw the ball to a teammate after a few seconds
        if (this.timeToNextActionWithBall && this.timeToNextActionWithBall <= this.scene.time.now) {
          if (!this.pass(false, false, false, false, true)) {
            // Nobody open, go to next spot
            this.goToPositionX = this.x
            this.goToPositionY = Phaser.Math.RND.pick([this.y - 150, this.y + 150])

            this.timeToNextActionWithBall = this.scene.time.now + Phaser.Math.RND.between(250, 500)
          }
        }
        force = 0.3
      } else if (this.goToPositionTime <= this.scene.time.now) {
        this.goToPositionTime = this.scene.time.now + Phaser.Math.RND.integerInRange(0, 500)
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

        // If there is a spot between the ball and the goal, then move there.
        // The AI will move around the spot so their defense is not perfect.
        if (hasGuardSpot) {
          this.goToPositionX = Phaser.Math.RND.integerInRange(guardPoint.x - 25, guardPoint.x + 25)
          this.goToPositionY = Phaser.Math.RND.integerInRange(guardPoint.y - 50, guardPoint.y + 50)
        } else {
          // If the ball is being held behind the goal,
          // The goalie stays on his line matches the Y position.
          // Again, there is some variance so the defense is not perfect
          const goToY =
            state.ball!.y > this.startY + 200
              ? this.startY + 200
              : state.ball!.y < this.startY - 200
              ? this.startY - 200
              : state.ball!.y
          this.goToPositionX = Phaser.Math.RND.integerInRange(this.startX - 25, this.startX + 25)
          this.goToPositionY = Phaser.Math.RND.integerInRange(goToY - 50, goToY + 50)
        }
      }
      this.moveToPosition(this.goToPositionX, this.goToPositionY, force)
    } else {
      // Check if stuck behind the goals
      if (
        (this.x <= state.homeGoal!.x && this.y >= state.homeGoal!.y - 250 && this.y <= state.homeGoal!.y + 250) ||
        (this.x >= state.awayGoal!.x && this.y >= state.homeGoal!.y - 250 && this.y <= state.homeGoal!.y + 250)
      ) {
        if (this.y <= state.homeGoal!.y) {
          this.goToPositionY = state.homeGoal!.y - 350
        } else {
          this.goToPositionY = state.homeGoal!.y + 350
        }

        this.moveToPosition(this.goToPositionX, this.goToPositionY)
      }
      // If this guy is closest to the ball on defense or in a loose ball situation,
      // move to the ball.
      else if (
        (this.team === 'home' && state.homeClosestToBall === this && !state.awayGoalie?.ball) ||
        (this.team === 'away' && state.awayClosestToBall === this && !state.homeGoalie?.ball)
      ) {
        this.moveToPosition(state.ball!.x, state.ball!.y)
      } else {
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

      // Shoot on goal if close enough
      if (
        this.ball &&
        this.team === 'home' &&
        Phaser.Math.Distance.Between(this.x, this.y, state.awayGoal!.x, state.awayGoal!.y) <= 400
      ) {
        this.ball.shootAtTarget(state.awayGoal!)
        this.dropBall()
        this.timeToNextActionWithBall = undefined
      } else if (
        this.ball &&
        this.team === 'away' &&
        Phaser.Math.Distance.Between(this.x, this.y, state.homeGoal!.x, state.homeGoal!.y) <= 400
      ) {
        this.ball.shootAtTarget(state.homeGoal!)
        this.dropBall()
        this.timeToNextActionWithBall = undefined
      }

      // The AI will throw the ball to a teammate after a few seconds
      if (this.ball && this.timeToNextActionWithBall && this.timeToNextActionWithBall <= this.scene.time.now) {
        this.pass(false, false, false, false, false)
      }
    }
  }
}
