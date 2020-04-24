import { gameSettings, settingsHelpers } from '../consts'
import { controls } from '../game-init'
import { Ball } from './ball'
import { state } from '../states'

const circleRadius = 32

export const createGuy = (scene: Phaser.Scene) => {
  const guy = new Guy(scene.matter.world, 700, settingsHelpers.fieldHeightMid, 'guy1', undefined, {
    circleRadius,
    friction: 0.03,
    frictionAir: 0.03,
    frictionStatic: 0.03,
    density: 0.065,
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
    const cursors = controls.cursors!
    const spacebar = controls.spacebar!

    const force = 0.1

    if (cursors.left?.isDown) {
      this.applyForce(new Phaser.Math.Vector2(-force, 0))
    }

    if (cursors.right?.isDown) {
      this.applyForce(new Phaser.Math.Vector2(force, 0))
    }

    if (cursors.up?.isDown) {
      this.applyForce(new Phaser.Math.Vector2(0, -force))
    }

    if (cursors.down?.isDown) {
      this.applyForce(new Phaser.Math.Vector2(0, force))
    }

    if (spacebar.isDown && this.ball) {
      this.ball.shoot(state.goal!, circleRadius)
      this.ball = undefined
    }

    if (this.ball) {
      this.ball.setPosition(this.x, this.y)
    }
  }
}
