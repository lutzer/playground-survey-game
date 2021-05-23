import * as BABYLON from '@babylonjs/core'
import SimplexNoise from 'simplex-noise'
import { distinctUntilChanged, map, pairwise, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { from as fromPromise } from 'rxjs'

import '@babylonjs/loaders'

import { OrthographicCamera } from './camera'
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
  camera: OrthographicCamera

  textures : BABYLON.Texture[]

  stateMachine: Statemachine

  enablePointerEvents: boolean
  enable : boolean

  $disposeObservable : Subject<void>

  constructor({ canvas, settings, stateMachine } : { canvas: HTMLCanvasElement, settings: PlaygroundSettings, stateMachine: Statemachine } ) {
    this.canvas = canvas
    this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true })
    this.scene = new BABYLON.Scene(this.engine,{})
    this.stateMachine = stateMachine
    this.settings = settings
    this.enablePointerEvents = true

    // start disabled
    this.enable = false

    this.$disposeObservable = new Subject()

    this.textures = []

    this.camera = new OrthographicCamera(this.scene, this.canvas, this.settings.camera.zoom)

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

    // register tile setup events
    tileManager.on('tile-setup', (args) => { this.stateMachine.trigger(Actions.setupTile, args) })

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
        this.camera.enableControl = selectedTile == undefined
        tileManager.setSelectMarker(selectedTile)
      })

    // load assets
    fromPromise(loadAssets(this.scene, playGroundType))
      .pipe(takeUntil(this.$disposeObservable))
      .subscribe(({tileMeshes, textures}) => {
        tileManager.meshes = tileMeshes
        tileManager.textures = textures

        // setup tiles
        tileManager.setup(this.settings.width, this.settings.height)

        // update tiles from current state
        tileManager.handleTileChange(this.stateMachine.state.tiles)

        optimizePerformance(this.scene)
        this.camera.attachControl()
        onLoaded()
      })

  
    // show axis
    // showAxis(5,this.scene)

    setupLights(this.scene)
    

    //createSkyBox(this.scene)
    showGroundPlane(45, this.scene)
    // createSkyDome(this.scene)

    const fpsText = setupFpsDisplay()

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
      
      //animate tile movement
      tileManager.tiles.forEach((tile,i) => {
        if (!tile.isEntering)
          tile.position.y = simplex.noise2D(i,time * 0.0001) * 0.05
      })
    }

    // start render loop
    this.engine.runRenderLoop(() => {
      if (this.enable)
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
      const size = { height: this.canvas.height*2, width: this.canvas.width*2}
      BABYLON.Tools.CreateScreenshotUsingRenderTarget(this.engine, this.camera.camera, size)
    }
  }

  resize() : void {
    this.camera.onResize()
    this.engine.resize()
  }

  enableMouse(enable: boolean) {
    this.enablePointerEvents = enable
    this.camera.enableControl = enable
  }
}

export { Playground }
export type { PlaygroundSettings }

