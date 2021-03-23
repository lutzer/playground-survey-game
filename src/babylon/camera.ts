import { ArcRotateCamera, Camera, Scene, Vector3 } from '@babylonjs/core'

const setupCamera = function(scene: Scene, canvas: HTMLCanvasElement) : Camera {

  const camera = new ArcRotateCamera('camera', -Math.PI * 1.25, Math.PI / 5, 25, new Vector3(0, 0, 0), scene)
  camera.attachControl(canvas, true)
  // camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
  // camera.orthoLeft = -10;
  // camera.orthoRight = 10;
  // camera.orthoBottom = -10;
  // camera.orthoTop = 10;
  return camera
}

export { setupCamera}