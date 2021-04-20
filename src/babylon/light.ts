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
 
  return { sunLight : dirLight, hemisphericLight: light }
}

export { setupLights }