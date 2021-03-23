import * as BABYLON from '@babylonjs/core'
import SimplexNoise from 'simplex-noise'

import { setupCamera } from './camera'
import { setupLights } from './light'
import { Tile } from './tile'
import { createGrid } from './grid'

const settings = {
  gridSize: 10,
  width: 10,
  height: 10
}

const createScene = function(engine: BABYLON.Engine, canvas: HTMLCanvasElement) : BABYLON.Scene {

  const scene = new BABYLON.Scene(engine,{})
    
  const startTime = Date.now()
  const simplex = new SimplexNoise()

  setupCamera(scene, canvas)
  setupLights(scene)

  const grid = createGrid(settings.gridSize)
  const tiles = grid.map(([x,y], i) => {
    const tile = new Tile(`box${i}`, scene)
    tile.pos = new BABYLON.Vector3(
      x * settings.width - settings.width/2, 
      0,
      y * settings.height - settings.height/2)
    tile.show()
    return tile
  })

  // const ground = BABYLON.MeshBuilder.CreateGround('ground', {width: settings.width, height: settings.height})
  // scene.addMesh(ground)
  // ground.receiveShadows = true

  scene.onBeforeRenderObservable.add((t) => {
    const time = Date.now()-startTime
    tiles.forEach((tile,i) => {
      tile.mesh.position.y = simplex.noise2D(i,time * 0.001) * 0.1
    })
  })

  engine.runRenderLoop(function () {
    scene.render()
  })

  return scene
}

export { createScene }