import * as BABYLON from '@babylonjs/core'
import SimplexNoise from 'simplex-noise'

import '@babylonjs/loaders'

import { setupCamera } from './camera'
import { setupLights } from './light'
import { TileManager } from './tile'
import { createGrid } from './grid'
import { loadAssets } from './assets'
import { showAxis } from './helpers'

const settings = {
  gridSize: 10,
  width: 10,
  height: 10
}

const setupScene = function(engine: BABYLON.Engine, canvas: HTMLCanvasElement) : BABYLON.Scene {

  const scene = new BABYLON.Scene(engine,{})
  const simplex = new SimplexNoise()

  setupCamera(scene, canvas)
  setupLights(scene)

  const grid = createGrid(settings.gridSize)

  // setup tiles
  const tileManager = new TileManager(scene, grid)

  loadAssets(scene, (container) => {
    const meshes = container.loadedMeshes.map((m) => <BABYLON.Mesh>m )
    
    const tree = meshes[0].clone()
    tree.setEnabled(false)

    tileManager.setup(settings.width, settings.height, tree)
  })

  // call loop function
  const startTime = Date.now()
  scene.onBeforeRenderObservable.add(() => {
    loop(Date.now() - startTime)
  })

  // mouse and touch events
  scene.onPointerObservable.add((pointerInfo) => {      		
    switch (pointerInfo.type) {
    case BABYLON.PointerEventTypes.POINTERDOWN:
      if (pointerInfo.pickInfo?.hit)
        tileManager.selectTile(pointerInfo.pickInfo.pickedMesh?.name)
    }
  })

  // show ground plane
  // const ground = BABYLON.MeshBuilder.CreateGround('ground', {width:10, height:10})

  //show axis
  showAxis(10,scene)

  // start render loop
  engine.runRenderLoop(function () {
    scene.render()
  })

  // gets called before every render
  function loop(time: number) {
    tileManager.tiles.forEach((tile,i) => {
      if (tile.node)
        tile.node.position.y = simplex.noise2D(i,time * 0.0005) * 0.1
    })
  }

  
  // scene.debugLayer.show()

  return scene
}

export { setupScene }