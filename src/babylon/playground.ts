import * as BABYLON from '@babylonjs/core'
import SimplexNoise from 'simplex-noise'
import { distinctUntilChanged, map, pairwise } from 'rxjs/operators'
import _ from 'lodash'
import { Subscription } from 'rxjs'

import '@babylonjs/loaders'

import { setupCamera } from './camera'
import { setupLights } from './light'
import { TileManager, TileMeshArray } from './tile'
import { createGrid } from './grid'
import { loadAssets } from './assets'
import { showAxis } from './helpers'
import { Actions, Statemachine } from '../state'
import { Camera } from '@babylonjs/core'

// import '@babylonjs/inspector'

type PlaygroundSettings = {
  gridSize: number
  width: number
  height: number
  camera: {
    isometric: boolean
    zoom: number
  },
  version: string
}

class Playground {

  canvas: HTMLCanvasElement
  engine: BABYLON.Engine 
  scene: BABYLON.Scene
  settings : PlaygroundSettings
  camera: BABYLON.Camera | undefined

  stateMachine: Statemachine
  subscriptions : Subscription[] = []

  constructor({ canvas, settings, stateMachine } : { canvas: HTMLCanvasElement, settings: PlaygroundSettings, stateMachine: Statemachine } ) {
    this.canvas = canvas
    this.engine = new BABYLON.Engine(canvas, true)
    this.scene = new BABYLON.Scene(this.engine,{})
    this.stateMachine = stateMachine
    this.settings = settings
  }

  dispose() : void {
    console.log('dispose playground')
    this.scene.dispose()
    this.engine.dispose()
    this.subscriptions.map((s) => s.unsubscribe())
  }

  // unselectTile() {
  //   this.tileManager?.selectTile(undefined)
  // } 

  init() : void {

    console.log('init playground')
  
    // scene.clearColor = BABYLON.Color4.FromHexString('#000000FF')
  
    this.camera = setupCamera(this.scene, this.canvas, this.settings.camera.isometric, this.settings.camera.zoom)
    setupLights(this.scene)
  
    const grid = createGrid(this.settings.gridSize)
  
    // setup tiles
    const tileManager = new TileManager(this.scene, grid, this.stateMachine.state)

    // sync change in tiles states with meshes
    this.subscriptions.push(this.stateMachine
      .pipe(distinctUntilChanged((curr, prev) => _.isEqual(curr.tiles, prev.tiles)))
      .subscribe((state) => {
        tileManager.handleTileChange(state.tiles)
      })
    )
    
    // set select cursor for tiles
    this.subscriptions.push(this.stateMachine
      .pipe(map((state) => state.selectedTile), distinctUntilChanged())
      .subscribe((selectedTile) => {
        tileManager.setSelectMarker(selectedTile)
      })
    )
  
    // load assets
    loadAssets(this.scene, (containers) => {
      
      const tileMeshes = containers.reduce<TileMeshArray>((acc, c) => {
        const mesh = c.loadedMeshes[0].clone(c.meshesNames, null)
        mesh?.setEnabled(false)
        acc[c.meshesNames] = <BABYLON.Mesh>mesh
        return acc
      }, {})
  
      tileManager.meshes = tileMeshes
  
      tileManager.setup(this.settings.width, this.settings.height)
      tileManager.on('tile-selected', (id) => this.stateMachine.trigger(Actions.selectTile, { id: id }) )
    })
  
    // call loop function
    const startTime = Date.now()
    this.scene.onBeforeRenderObservable.add(() => {
      loop(Date.now() - startTime)
    })
  
    //show axis
    //showAxis(10,this.scene)
  
    // start render loop
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  
    // gets called before every render
    const simplex = new SimplexNoise()
    function loop(time: number) {
      tileManager.tiles.forEach((tile,i) => {
        tile.position.y = simplex.noise2D(i,time * 0.0005) * 0.05
      })
    }
  }

  resize() : void {
    if (this.camera?.mode == Camera.ORTHOGRAPHIC_CAMERA) {
      const aspectRatio = this.engine.getAspectRatio(this.camera)
      this.camera.orthoLeft = -this.settings.camera.zoom * aspectRatio
      this.camera.orthoRight = this.settings.camera.zoom * aspectRatio
    }
    this.engine.resize()
  }
}

export { Playground }
export type { PlaygroundSettings }

