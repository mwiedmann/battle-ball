import { controls, titleScreen } from './game-init'
import { gameSettings, settingsHelpers } from './consts'

export type IGameState = 'title' | 'game'
export let gameState = 'title'

let testObjects: Phaser.Physics.Matter.Image[] = []
let mapCamera: Phaser.Cameras.Scene2D.Camera

export function update(this: Phaser.Scene, time: number, delta: number) {
  // Grab the global cursor controls
  const cursors = controls.cursors!
  const spacebar = controls.spacebar!

  if (gameState === 'title' && spacebar.isDown) {
    gameState = 'game'
    titleScreen.destroy()

    const goalShape = this.cache.json.get('goal')
    const goal = this.matter.add.image(300, settingsHelpers.fieldHeightMid, 'goal', undefined, {
      shape: goalShape.goal,
      isStatic: true,
    } as any)

    for (let i = 0; i < 100; i++) {
      let testObject = this.matter.add.image(
        Phaser.Math.RND.between(50, gameSettings.fieldWidth - 50),
        Phaser.Math.RND.between(50, gameSettings.fieldHeight - 50),
        'test'
      )
      testObject.setCircle(16)
      testObject.setFriction(0.01, 0.01, 0.01)
      testObject.setBounce(0.8)

      testObjects.push(testObject)
    }

    spacebar.on('down', () => {
      console.log('down')
      testObjects.forEach((t) =>
        t.applyForce(
          new Phaser.Math.Vector2(Phaser.Math.RND.between(-100, 100) / 5000, Phaser.Math.RND.between(-100, 100) / 5000)
        )
      )
    })

    this.cameras.main.setZoom(gameSettings.gameCameraZoom)
    this.cameras.main.setDeadzone(200, 200)
    this.cameras.main.startFollow(goal)
    this.cameras.main.setLerp(0.1, 0.1)

    mapCamera = this.cameras.add(0, 0, settingsHelpers.mapCameraWidth, settingsHelpers.mapCameraHeight)
    mapCamera.setScroll(settingsHelpers.fieldWidthMid, settingsHelpers.fieldHeightMid)
    mapCamera.setZoom(gameSettings.mapCameraZoom)
  }

  if (gameState === 'game') {
    if (cursors.down?.isDown) {
      this.cameras.main.scrollY = this.cameras.main.scrollY + 5
    }
    if (cursors.up?.isDown) {
      this.cameras.main.scrollY = this.cameras.main.scrollY - 5
    }
    if (cursors.right?.isDown) {
      this.cameras.main.scrollX = this.cameras.main.scrollX + 5
    }
    if (cursors.left?.isDown) {
      this.cameras.main.scrollX = this.cameras.main.scrollX - 5
    }
  }
}
