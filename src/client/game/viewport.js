import _ from 'underscore'

function lowerOdd(number) {
  number = Math.round(number)
  if (number % 2 != 0) {
    return number - 1
  } else {
    return number
  }
}

/**
* Scales the source to fit the target while keeping the same aspect ratio.
* This may cause the source to be smaller than the target in one direction.
*/
export function scaleToFit(sourceWidth, sourceHeight, targetWidth, targetHeight) {
  let targetRatio = targetHeight / targetWidth
  let sourceRatio = sourceHeight / sourceWidth
  let scale = targetRatio > sourceRatio ? targetWidth / sourceWidth : targetHeight / sourceHeight

  return scale
}

/**
* Fill the screen and then scale game some number of times
*/
export class FillViewport {
  constructor(container) {
    this.container = container

    this.minWorldWidth = 40 * 16
    this.minWorldHeight = 30 * 16
  }

  get viewportWidth() {
    return this.container.parentElement.clientWidth
  }

  get viewportHeight() {
    return this.container.parentElement.clientHeight
  }

  get scale() {
    return Math.round(scaleToFit(this.minWorldWidth, this.minWorldHeight, this.viewportWidth, this.viewportHeight))
  }

  update() {
    let viewportWidth = this.viewportWidth
    let viewportHeight = this.viewportHeight
    return {
      worldWidth: Math.round(viewportWidth / this.scale),
      worldHeight: Math.round(viewportHeight / this.scale),
      viewportWidth,
      viewportHeight,
      marginTop: 0
    }
  }
}

export class ExpandViewport {
  /** Creates a new viewport with a maximum world size.
   * @param maxWorldWidth User 0 for no maximum width.
   * @param maxWorldHeight User 0 for no maximum height.
   */
  constructor(minWorldWidth, minWorldHeight, maxWorldWidth, maxWorldHeight) {
    this.minWorldWidth = minWorldWidth
    this.minWorldHeight = minWorldHeight
    this.maxWorldWidth = maxWorldWidth
    this.maxWorldHeight = maxWorldHeight
  }

  update(screenWidth, screenHeight) {
    // Fit min size to the screen.
    let worldWidth = this.minWorldWidth
    let worldHeight = this.minWorldHeight
    this.scale = scaleToFit(worldWidth, worldHeight, screenWidth, screenHeight)

    let viewportWidth = lowerOdd(worldWidth * this.scale)
    let viewportHeight = lowerOdd(worldHeight * this.scale)

    let roundScale = Math.max(1, Math.floor(viewportHeight / worldHeight))
    viewportWidth = roundScale * worldWidth
    viewportHeight = roundScale * worldHeight

    let marginTop = (screenHeight - viewportHeight) / 2
    return {
      worldWidth,
      worldHeight,
      viewportWidth,
      viewportHeight,
      marginTop
    }
  }
}

export const viewport = new ExpandViewport(
  30 * 16, 20 * 16,
  36 * 16, 25 * 16
)

// export const viewport = new FillViewport()
