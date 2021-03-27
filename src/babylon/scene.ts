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
  gridSize: 6,
  width: 6,
  height: 6
}

const setupScene = function(engine: BABYLON.Engine, canvas: HTMLCanvasElement) : BABYLON.Scene {

  const scene = new BABYLON.Scene(engine,{})

  scene.clearColor = BABYLON.Color4.FromHexString('#000000FF')

  setupCamera(scene, canvas)
  setupLights(scene)

  const grid = createGrid(settings.gridSize)

  // setup tiles
  const tileManager = new TileManager(scene, grid)

  loadAssets(scene, (containers) => {
    const meshes = containers[1].loadedMeshes.map((m) => <BABYLON.Mesh>m )
    
    const tileMeshes = containers.map((c) => {
      const mesh = c.loadedMeshes[0].clone(c.meshesNames, null)
      mesh?.setEnabled(false)
      return <BABYLON.Mesh>mesh
    })

    tileManager.meshes = tileMeshes

    // console.log(tileMeshes)

    // const tree = meshes[0].clone()
    // tree.setEnabled(false)

    tileManager.setup(settings.width, settings.height)
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
  const simplex = new SimplexNoise()
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