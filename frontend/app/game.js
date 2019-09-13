/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// This function runs when the Game Screen is ON
function gamePlay() {
  // Floating Text effects
  for (let i = 0; i < floatingTexts.length; i += 1) {
    floatingTexts[i].update()
    floatingTexts[i].render()
  }

  // Particle effects
  for (let i = 0; i < particles.length; i += 1) {
    if (particles[i]) {
      particles[i].render()
      particles[i].update()
    }
  }

  // Draw Timer! (Comment this blob of code if you don't want timer)
  if (Koji.config.strings.enableTimer && gameTimerEnabled) {
    gameTimer -= 1 / frameRate()
    drawTimer()
  }

  // Spawn a ball every second
  ;(() => {
    ballTimer += 1 / frameRate()
    if (ballTimer >= 1.25) {
      const ballType = random(ballTypes)

      balls.push(
        new Ball(
          {
            x: width / 2,
            y: 0 - objSize * 2,
          },
          { radius: objSize * ballSize },
          {
            shape: 'circle',
            image: ballType.image,
            rotate: true,
            type: ballType.type,
          }
        )
      )

      ballTimer = 0
    }
  })()

  // InGame UI
  wheels.forEach(wheel => {
    wheel.show()
    wheel.rotate()
  })

  balls.forEach(ball => {
    ball.show()
    ball.update()
  })

  firedBalls.forEach(firedBall => {
    firedBall.show()
    firedBall.project()
    firedBall.update()
  })

  particledBalls.forEach(particledBall => {
    particledBall.show()
    particledBall.project()
    particledBall.update()
  })

  // Swipe Detector
  hammer.on('swipe', event => {
    if (!canEnd && balls.length > 0 && isMobile && event.direction === 4) {
      balls[0].fire('right')
    } else if (event.direction === 8) {
      swipe = 'up'
    } else if (event.direction === 16) {
      swipe = 'down'
    } else if (
      !canEnd &&
      balls.length > 0 &&
      isMobile &&
      event.direction === 2
    ) {
      balls[0].fire('left')
    }
  })

  const floatingTextSize = isMobileSize ? 2 : 4

  // Collision check
  wheels.forEach(wheel => {
    firedBalls.forEach(firedBall => {
      if (
        wheel.didTouch({
          sizing: { radius: firedBall.sizing.radius },
          body: firedBall.body,
        })
      ) {
        if (wheel.settings.type === firedBall.settings.type) {
          particledBalls.push(firedBall)

          firedBalls.pop()

          floatingTexts.push(
            new FloatingText(
              width / 2,
              height / 2,
              random(comboTexts),
              Koji.config.colors.floatingTextColor,
              objSize * floatingTextSize
            )
          )

          addScore(
            1,
            imgLife,
            {
              x: firedBall.body.position.x,
              y: firedBall.body.position.y,
            },
            10,
            { floatingText: isMobileSize }
          )
        } else {
          firedBalls.pop()

          floatingTexts.push(
            new FloatingText(
              width / 2,
              height / 2,
              Koji.config.strings.wrongCrushText,
              Koji.config.colors.negativeFloatingTextColor,
              objSize * floatingTextSize
            )
          )

          particlesEffect(
            imgBalls[firedBall.settings.type],
            {
              x: firedBall.body.position.x,
              y: firedBall.body.position.y,
            },
            20
          )

          if (lives === 1) {
            setTimeout(loseLife, 1000)
          } else {
            loseLife()
          }
        }
      }
    })
  })

  // For particle type effect
  wheels.forEach(wheel => {
    particledBalls.forEach(particledBall => {
      if (
        wheel.didTouch({
          sizing: { radius: particledBall.sizing.radius },
          body: particledBall.body,
        })
      ) {
        if (wheel.settings.type === particledBall.settings.type) {
          particlesEffect(
            imgLife,
            {
              x: particledBall.body.position.x,
              y: particledBall.body.position.y,
            },
            2
          )
        }
      }
    })
  })

  // Score draw
  const scoreX = width - objSize / 2
  const scoreY = objSize / 3
  textSize(objSize * 2)
  fill(Koji.config.colors.scoreColor)
  textAlign(RIGHT, TOP)
  text(score, scoreX, scoreY)

  // Lives draw
  const lifeSize = objSize
  for (let i = 0; i < lives; i += 1) {
    image(
      imgLife,
      lifeSize / 2 + lifeSize * i,
      lifeSize / 2,
      lifeSize,
      lifeSize
    )
  }

  cleanup()
}
