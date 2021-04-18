import { Color3, DirectionalLight, HemisphericLight, Light, PointLight, Scene, SpotLight, Vector3 } from '@babylonjs/core'

const setupLights = function(scene : Scene) : { sunLight : DirectionalLight, hemisphericLight : HemisphericLight } {
  const light = new HemisphericLight('light', new Vector3(0, -1, 0),scene)
  light.intensity = 2
  light.groundColor = new Color3(148/255, 41/255, 60/255)
  // light.setEnabled(false)

  const dirLight = new DirectionalLight('dir', new Vector3(0, -1, 0), scene)
  dirLight.position = new Vector3(0,5,0)
  dirLight.setDirectionToTarget(new Vector3(0,0,0))
  dirLight.intensity = 10
  dirLight.diffuse = new Color3(255/255, 255/255, 153/255)
  // dirLight.setEnabled(false)
  // dirLight.specular = new Color3(255/255, 102/255, 255/255)
  // const shadowGenerator = new BABYLON.ShadowGenerator(1024, dirLight)

  const waterLight = new PointLight('pointLight', new Vector3(0, 2, 0), scene)
  waterLight.intensity = 20
  waterLight.range = 30
  // waterLight.setEnabled(false)
  waterLight.diffuse = new Color3(0,1.0,1.0)

  return { sunLight : dirLight, hemisphericLight: light }
}

export { setupLights }