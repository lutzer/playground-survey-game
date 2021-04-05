import { ArcRotateCamera, Camera, Scene, Vector3 } from '@babylonjs/core'

const setupCamera = function(scene: Scene, canvas: HTMLCanvasElement, orthographic: boolean, zoom : number) : Camera {

  const camera = new ArcRotateCamera('camera', -Math.PI * 1.25, Math.PI / 4, 25, new Vector3(0, 0, 0), scene)
  if (orthographic) {
    camera.mode = Camera.ORTHOGRAPHIC_CAMERA
    camera.orthoLeft = -zoom * scene.getEngine().getAspectRatio(camera)
    camera.orthoRight = zoom * scene.getEngine().getAspectRatio(camera)
    camera.orthoBottom = -zoom
    camera.orthoTop = zoom
  } else {
    camera.attachControl(canvas, true)
  }
  return camera
}

export { setupCamera}