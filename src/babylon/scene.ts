import * as BABYLON from '@babylonjs/core'
import SimplexNoise from 'simplex-noise'

import '@babylonjs/loaders'

import { setupCamera } from './camera'
import { setupLights } from './light'
import { TileManager, TileMeshArray } from './tile'
import { createGrid } from './grid'
import { loadAssets } from './assets'
import { showAxis } from './helpers'
import EventEmitter from 'events'

// import '@babylonjs/inspector'

const settings = {
  gridSize: 6,
  width: 6,
  height: 6
}

class Playground extends EventEmitter {

  canvas: HTMLCanvasElement
  engine: BABYLON.Engine 
  scene: BABYLON.Scene

  tileManager?: TileManager

  constructor({ canvas } : { canvas: HTMLCanvasElement } ) {
    super()
    this.canvas = canvas
    this.engine = new BABYLON.Engine(canvas, true)
    this.scene = new BABYLON.Scene(this.engine,{})
  }

  dispose() : void {
    this.scene.dispose()
    this.engine.dispose()
  }

  unselectTile() {
    this.tileManager?.selectTile(undefined)
  } 

  init() : void {
  
    // scene.clearColor = BABYLON.Color4.FromHexString('#000000FF')
  
    setupCamera(this.scene, this.canvas)
    setupLights(this.scene)
  
    const grid = createGrid(settings.gridSize)
  
    // setup tiles
    const tileManager = new TileManager(this.scene, grid)
  
    // load assets
    loadAssets(this.scene, (containers) => {
      
      const tileMeshes = containers.reduce<TileMeshArray>((acc, c) => {
        const mesh = c.loadedMeshes[0].clone(c.meshesNames, null)
        mesh?.setEnabled(false)
        acc[c.meshesNames] = <BABYLON.Mesh>mesh
        return acc
      }, {})
  
      tileManager.meshes = tileMeshes
  
      tileManager.setup(settings.width, settings.height)
      tileManager.on('tile-selected', (t) => this.emit('tile-selected', t) )
      // tileManager.on('tile-selected', (t) => { if (onTileSelected) onTileSelected(<Tile>t) } )
    })
  
    // call loop function
    const startTime = Date.now()
    this.scene.onBeforeRenderObservable.add(() => {
      loop(Date.now() - startTime)
    })
  
    //show axis
    showAxis(10,this.scene)
  
    // start render loop
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  
    // gets called before every render
    const simplex = new SimplexNoise()
    function loop(time: number) {
      tileManager.tiles.forEach((tile,i) => {
        if (tile.node)
          tile.node.position.y = simplex.noise2D(i,time * 0.0005) * 0.05
      })
    }

    this.tileManager = tileManager
  }
}

export { Playground }