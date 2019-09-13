/* eslint-disable no-unused-vars */
/*
  global
  GameObject
  Smooth
  firedBalls
  balls
*/

class Ball extends GameObject {
  removable = false

  velocity = 0

  maxVelocity = 20

  fireDirection = null

  update() {
    this.rotate()

    this.velocity = Smooth(this.velocity, this.maxVelocity, 100)
    this.body.position.y += this.velocity

    if (this.wentOutOfFrame()) this.removable = true
  }

  /**
   * Fire the ball towards one wheel
   * @param {string | null} direction - 'left', 'right' or null
   */
  fire(direction = null) {
    this.fireDirection = direction
    firedBalls.push(this)
    balls.splice(0, 1) // Remove first ball
  }

  // Here's how the fire is projected
  project() {
    if (this.fireDirection === 'left') {
      this.body.position.x -= 20
    }
    if (this.fireDirection === 'right') {
      this.body.position.x += 20
    }
  }
}
