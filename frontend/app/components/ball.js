/* eslint-disable no-unused-vars */
/*
  global
  GameObject
  Smooth
*/

class Ball extends GameObject {
  removable = false

  velocity = 0

  maxVelocity = 20

  update() {
    this.rotate()

    this.velocity = Smooth(this.velocity, this.maxVelocity, 100)
    this.body.position.y += this.velocity

    if (this.wentOutOfFrame()) this.removable = true
  }
}
