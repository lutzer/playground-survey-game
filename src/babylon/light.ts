import { DirectionalLight, HemisphericLight, Light, Scene, Vector3 } from '@babylonjs/core'

const setupLights = function(scene : Scene) : Light[] {
  const light = new HemisphericLight('light', new Vector3(0, 1, 0),scene)
  light.intensity = 0.4
  const dirLight = new DirectionalLight('dir', new Vector3(0, -1, 0), scene)
  dirLight.position.y = 10
  scene.addLight(light)
  scene.addLight(dirLight)
  // const shadowGenerator = new BABYLON.ShadowGenerator(1024, dirLight)
  return [light, dirLight]
}

export { setupLights }