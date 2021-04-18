import { ArcRotateCamera, Camera, Scene, Vector3 } from '@babylonjs/core'

const MAX_DISTANCE = 20
const MIN_DISTANCE = 5

const setupCamera = function(scene: Scene, canvas: HTMLCanvasElement, orthographic: boolean, zoom : number) : Camera {
  const camera = new ArcRotateCamera('camera', -Math.PI * 1.25, Math.PI / 4, zoom * 2.5, new Vector3(0, 0, 0), scene)
  if (orthographic) {
    camera.mode = Camera.ORTHOGRAPHIC_CAMERA
    camera.orthoLeft = -zoom * scene.getEngine().getAspectRatio(camera)
    camera.orthoRight = zoom * scene.getEngine().getAspectRatio(camera)
    camera.orthoBottom = -zoom
    camera.orthoTop = zoom
  } else {
    camera.lowerBetaLimit = 0
    camera.upperBetaLimit = Math.PI * 0.45
    camera.lowerRadiusLimit = MIN_DISTANCE
    camera.upperRadiusLimit = MAX_DISTANCE
    camera.panningDistanceLimit = 0.001
    camera.attachControl(canvas, true)
  }
  camera.storeState()
  return camera
}

export { setupCamera}