import { Color3, CubeTexture, DynamicTexture, Mesh, MeshBuilder, Node, Scene, StandardMaterial, Vector3 } from '@babylonjs/core'
import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture'
import { Control } from '@babylonjs/gui/2D/controls/control'
import { StackPanel } from '@babylonjs/gui/2D/controls/stackPanel'
import { TextBlock } from '@babylonjs/gui/2D/controls/textBlock'
import { SkyMaterial } from '@babylonjs/materials'
import { GradientMaterial } from '@babylonjs/materials/gradient/gradientMaterial'
import { GridMaterial } from '@babylonjs/materials/grid/gridMaterial'

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

const showGroundPlane = function(size: number, scene : Scene, yOffset = 0) : void {
  
  //create ground
  const ground = MeshBuilder.CreateGround('ground', {width:size, height:size})
  const groundMaterial = new StandardMaterial('ground',scene)
  const texture = new Texture('assets/textures/ground.jpg', scene)
  texture.uScale = texture.vScale = 30
  groundMaterial.diffuseTexture = texture
  groundMaterial.specularColor = new Color3(0, 0, 0)
  ground.material = groundMaterial
  ground.position.y = yOffset
  scene.addMesh(ground)

  //create Grid
  const grid = MeshBuilder.CreateGround('ground', {width:size, height:size})
  const gridMaterial = new GridMaterial('default', scene)
  gridMaterial.majorUnitFrequency = 1
  gridMaterial.minorUnitVisibility = 0
  gridMaterial.gridRatio = 1.02
  gridMaterial.backFaceCulling = false
  gridMaterial.mainColor = new Color3(0, 0, 0)
  gridMaterial.lineColor = new Color3(1.0, 1.0, 1.0)
  gridMaterial.opacity = 0.1
  grid.material = gridMaterial
  grid.position.y = yOffset
  scene.addMesh(grid)

  // const material = new GradientMaterial('grad', scene)
  // material. = Color3.Black() // Set the gradient top color
  // material.bottomColor = Color3.White() // Set the gradient bottom color
  // material.offset = 0.25

  
}

const createSkyBox = function(scene : Scene) : void  {  
  const skybox = Mesh.CreateBox('skyBox', 100, scene, false, Mesh.BACKSIDE)
  skybox.rotate(new Vector3(0,0,1), 180)
  const skyMaterial = new SkyMaterial('skyMaterial', scene)
  // skyMaterial.backFaceCulling = false
  skybox.material = skyMaterial
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