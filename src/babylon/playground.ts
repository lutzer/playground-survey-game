import * as BABYLON from '@babylonjs/core'
import SimplexNoise from 'simplex-noise'
import { distinctUntilChanged, map, pairwise, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'

import '@babylonjs/loaders'

import { PlaygroundCamera } from './camera'
import { setupLights } from './light'
import { createGrid, createPlanscheGrid, createRiverGrid } from './grid'
import { loadAssets } from './assets'
import { createSkyBox, createSkyDome, optimizePerformance, setupFpsDisplay, showAxis, showGroundPlane } from './helpers'
import { Actions, PlayGroundType, Statemachine } from '../state'
import { applyPostProccessing } from './postprocessing'
import { TileManager } from './tileManager'

// import '@babylonjs/inspector'

type PlaygroundSettings = {
  gridSize: number
  width: number
  height: number
  camera: {
    isometric: boolean
    zoom: number
  },
  version: string,
  selectableTiles: number
}

class Playground {

  canvas: HTMLCanvasElement
  engine: BABYLON.Engine 
  scene: BABYLON.Scene
  settings : PlaygroundSettings
  camera: PlaygroundCamera

  textures : BABYLON.Texture[]

  stateMachine: Statemachine

  enablePointerEvents: boolean

  $disposeObservable : Subject<void>

  constructor({ canvas, settings, stateMachine } : { canvas: HTMLCanvasElement, settings: PlaygroundSettings, stateMachine: Statemachine } ) {
    this.canvas = canvas
    this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true })
    this.scene = new BABYLON.Scene(this.engine,{})
    this.stateMachine = stateMachine
    this.settings = settings
    this.enablePointerEvents = true

    this.$disposeObservable = new Subject()

    this.textures = []

    this.camera = new PlaygroundCamera(this.scene, this.canvas, this.settings.camera.zoom)
    this.camera.enableControl(true)

    // ignore pointer events when disabled
    this.scene.onPrePointerObservable.add((pointerInfo) => {
      pointerInfo.skipOnPointerObservable = !this.enablePointerEvents
    })

  }

  dispose() : void {
    this.$disposeObservable.next()
    this.scene.dispose()
    this.engine.dispose()
  }

  init(playGroundType: PlayGroundType, onLoaded: () => void) : void {
    
    const grid = (playGroundType == 'pool') ? createPlanscheGrid(this.settings.gridSize) : createRiverGrid(this.settings.gridSize)
  
    // setup tiles
    const tileManager = new TileManager(this.scene, grid)

    // register select events
    tileManager.on('tile-selected', (id) => this.stateMachine.trigger(Actions.selectTile, { id: id }) )

    // sync change in tiles states with meshes
    this.stateMachine
      .pipe(pairwise(), takeUntil(this.$disposeObservable))
      .subscribe(([curr, prev]) => {
        tileManager.handleTileChange(curr.tiles, prev.tiles)
      })
    
    // set select cursor for tiles
    this.stateMachine
      .pipe(map((state) => state.selectedTile), distinctUntilChanged(), takeUntil(this.$disposeObservable))
      .subscribe((selectedTile) => {
        tileManager.setSelectMarker(selectedTile)
      })

    // load assets
    loadAssets(this.scene, playGroundType).then(({tileMeshes, textures}) => {
      tileManager.meshes = tileMeshes
      tileManager.textures = textures

      // setup tiles
      tileManager.setup(this.settings.width, this.settings.height)

      // update tiles from current state
      tileManager.handleTileChange(this.stateMachine.state.tiles)

      // make some performance optimizations
      optimizePerformance(this.scene)

      // call on loaded method
      onLoaded()
    })

  
    // show axis
    // showAxis(5,this.scene)

    setupLights(this.scene)
    //createSkyDome(this.scene)

    // createSkyBox(this.scene)
    // showGroundPlane(100, this.scene)

    const fpsText = setupFpsDisplay(this.scene)

    // applyPostProccessing(this.scene, this.engine, this.camera.camera)

    // call loop function
    const startTime = Date.now()
    this.scene.onBeforeRenderObservable.add(() => { loop(Date.now() - startTime) })

    const simplex = new SimplexNoise()
    let lastUpdate = 0
    const loop = (time: number) => {

      // only update every 200 ms
      if (time - lastUpdate > 200) {
        fpsText.text = 'fps: ' + Math.floor(this.engine.getFps())
        lastUpdate = time
      }
      
      // animate tile movement
      tileManager.tiles.forEach((tile,i) => {
        tile.position.y = simplex.noise2D(i,time * 0.0004) * 0.02
      })
    }

    // start render loop
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })

    // cleanup when scene is disposes
    this.scene.onDisposeObservable.add(() => {
      tileManager.dispose()
    })
  }
  takeScreenshot() : void {
    if (this.camera) {
      this.scene.render()
      BABYLON.Tools.CreateScreenshotUsingRenderTarget(this.engine, this.camera.camera, 1280)
    }
  }

  resize() : void {
    this.camera.onResize()
    this.engine.resize()
  }
}

export { Playground }
export type { PlaygroundSettings }

