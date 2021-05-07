import { Color3, CubeTexture, DynamicTexture, Mesh, MeshBuilder, Node, Scene, StandardMaterial, Vector3 } from '@babylonjs/core'
import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture'
import { Control } from '@babylonjs/gui/2D/controls/control'
import { StackPanel } from '@babylonjs/gui/2D/controls/stackPanel'
import { TextBlock } from '@babylonjs/gui/2D/controls/textBlock'
import { GradientMaterial } from '@babylonjs/materials/gradient/gradientMaterial'

const showAxis = function(size : number, scene : Scene) : void {

  const makeTextPlane = function(text : string, color : string, size : number) {
    const dynamicTexture = new DynamicTexture('DynamicTexture', 50, scene, true)
    dynamicTexture.hasAlpha = true
    dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color , 'transparent', true)
    const plane = Mesh.CreatePlane('TextPlane', size, scene, true)
    plane.isPickable = false
    const material = new StandardMaterial('TextPlaneMaterial', scene)
    material.backFaceCulling = false
    material.specularColor = new Color3(0, 0, 0)
    material.diffuseTexture = dynamicTexture
    plane.material = material
    return plane
  }

  const axisX = Mesh.CreateLines('axisX', [ 
    Vector3.Zero(), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0), 
    new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
  ], scene)
  axisX.color = new Color3(1, 0, 0)
  axisX.isPickable = false
  const xChar = makeTextPlane('X', 'red', size / 10)
  xChar.position = new Vector3(0.9 * size, -0.05 * size, 0)
  const axisY = Mesh.CreateLines('axisY', [
    Vector3.Zero(), new Vector3(0, size, 0), new Vector3( -0.05 * size, size * 0.95, 0), 
    new Vector3(0, size, 0), new Vector3( 0.05 * size, size * 0.95, 0)
  ], scene)
  axisY.color = new Color3(0, 1, 0)
  axisY.isPickable = false
  const yChar = makeTextPlane('Y', 'green', size / 10)
  yChar.position = new Vector3(0, 0.9 * size, -0.05 * size)
  const axisZ = Mesh.CreateLines('axisZ', [
    Vector3.Zero(), new Vector3(0, 0, size), new Vector3( 0 , -0.05 * size, size * 0.95),
    new Vector3(0, 0, size), new Vector3( 0, 0.05 * size, size * 0.95)
  ], scene)
  axisZ.color = new Color3(0, 0, 1)
  axisZ.isPickable = false
  const zChar = makeTextPlane('Z', 'blue', size / 10)
  zChar.position = new Vector3(0, 0.05 * size, 0.9 * size)
}

const showGroundPlane = function(size: number, scene : Scene) : void {
  const ground = MeshBuilder.CreateGround('ground', {width:size, height:size})
  const material = new StandardMaterial('ground',scene)
  // material.ambientColor = new Color3(77/255, 25/255, 51/255)
  // material.specularColor = new Color3(77/255, 25/255, 51/255)
  // material.emissiveColor = new Color3(77/255, 25/255, 51/255)
  // material.specularPower = 100
  // material.emi

  // var mat = new StandardMaterial("", scene);
  material.ambientTexture = new Texture('assets/textures/ground.jpg', scene)
  material.specularColor = new Color3(0, 0, 0)
  // material.specularPower = 0
  // ground.material = mat;

  ground.material = material
  ground.position.y = -1
  scene.addMesh(ground)
}

const createSkyBox = function(scene : Scene) : void  {  
  scene.createDefaultSkybox()
  // const skybox = MeshBuilder.CreateBox('skyBox', { size : 100.0 }, scene)
  // const skyboxMaterial = new StandardMaterial('skyBox', scene)
  // skyboxMaterial.backFaceCulling = false
  // skyboxMaterial.reflectionTexture = new CubeTexture('assets/textures/sky3/skybox', scene)
  // skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE
  // skyboxMaterial.diffuseColor = new Color3(0, 0, 0)
  // skyboxMaterial.specularColor = new Color3(0, 0, 0)
  // skybox.material = skyboxMaterial
  // skybox.position.y = 0
}

const createSkyDome = function(scene: Scene) : GradientMaterial {
  // const sphere = MeshBuilder.CreateBox('skyBox', { size : 1000.0 }, scene)
  const sphere = MeshBuilder.CreateSphere('sphere', { segments: 32, diameter: 100 }, scene)
  const gradientMaterial = new GradientMaterial('grad', scene)
  gradientMaterial.backFaceCulling = false
  // gradientMaterial.topColor = new Color3(0.3,0.3,0.3) // Set the gradient top color
  // gradientMaterial.bottomColor = new Color3(0,0,0) // Set the gradient bottom color
  gradientMaterial.topColor = new Color3(204/255, 102/255, 153/255)
  gradientMaterial.bottomColor = new Color3(77/255, 25/255, 51/255)
  gradientMaterial.offset = 0.5
  gradientMaterial.smoothness = 0.01
  sphere.material = gradientMaterial
  return gradientMaterial
}

const createFog = function(scene: Scene) : void {
  //enable fog mode
  scene.fogMode = Scene.FOGMODE_EXP
  scene.fogColor = new Color3(102/255, 130/255, 93/255)
  scene.fogDensity = 0.005
}

const getNodeChildren = function(node: Node) : string[] {
  const children = node.getChildren()
  if (!children)
    return []
  
  return children.reduce<string[]>((acc, child) => {
    acc.push(child.name)
    getNodeChildren(child).forEach((c) => acc.push(c))
    return acc
  },[])
}

const setupFpsDisplay = function() : TextBlock {
  const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI')
  const stackPanel = new StackPanel()
  stackPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
  stackPanel.isVertical = true
  advancedTexture.addControl(stackPanel)  

  const text = new TextBlock()
  text.text = '<fps>'
  text.color = 'white'
  text.fontSize = 16
  text.height = '30px'
  stackPanel.addControl(text)
  return text
}

const optimizePerformance = function(scene: Scene) : void {
  scene.autoClear = true // Color buffer
  scene.autoClearDepthAndStencil = false
  scene.freeActiveMeshes()
  scene.blockMaterialDirtyMechanism = true
}



export { showAxis, showGroundPlane, getNodeChildren, createSkyBox, createSkyDome, createFog, optimizePerformance, setupFpsDisplay }