export function generateCharsetAnimation(scene, animationName, atlas = 'charasAtlas') {
  if (scene.anims.anims.has(animationName)) {
    return animationName
  }

  let frames = scene.anims.generateFrameNames('charasAtlas', {
    prefix: animationName,
    //suffix: '.png',
    frames: [1, 0, 1, 2]
  })

  scene.anims.create({
    key: animationName,
    frames: frames,
    repeat: -1,
    frameRate: 10
  })

  return animationName
}

export function generateUiAnimation(scene, animationName, framesIndicies=[0,1,2]) {
  if (scene.anims.anims.has(animationName)) {
    return animationName
  }

  let frames = scene.anims.generateFrameNames('ui', {
    prefix: animationName,
    suffix: '.png',
    frames: framesIndicies
  })

  scene.anims.create({
    key: animationName,
    frames: frames,
    frameRate: 5,
    repeat: -1
  })

  return animationName
}
