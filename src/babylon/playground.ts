import * as BABYLON from '@babylonjs/core'
import SimplexNoise from 'simplex-noise'
import { distinctUntilChanged, map, pairwise, takeUntil } from 'rxjs/operators'
import _ from 'lodash'
import { Subject } from 'rxjs'

import '@babylonjs/loaders'

import { setupCamera } from './camera'
import { setupLights } from './light'
import { TextureArray, TileManager, TileMeshArray } from './tile'
import { createGrid, createPlanscheGrid } from './grid'
import { loadAssets } from './assets'
import { createSkyBox, showAxis, showGroundPlane } from './helpers'
import { Actions, Statemachine } from '../state'
import { applyPixelShader } from './postprocessing'

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

  textures : BABYLON.Texture[]

  stateMachine: Statemachine

  enablePointerEvents: boolean

  $disposeObservable : Subject<void>

  constructor({ canvas, settings, stateMachine } : { canvas: HTMLCanvasElement, settings: PlaygroundSettings, stateMachine: Statemachine } ) {
    this.canvas = canvas
    this.engine = new BABYLON.Engine(canvas, true)
    this.scene = new BABYLON.Scene(this.engine,{})
    this.stateMachine = stateMachine
    this.settings = settings
    this.enablePointerEvents = true

    this.$disposeObservable = new Subject()

    this.textures = []
  }

  dispose() : void {
    this.$disposeObservable.next()
    this.scene.dispose()
    this.engine.dispose()
  }

  init() : void {
    // this.scene.clearColor = BABYLON.Color4.FromHexString('#638C59FF')
  
    this.camera = setupCamera(this.scene, this.canvas, this.settings.camera.isometric, this.settings.camera.zoom)
    setupLights(this.scene)
  
    const grid = createPlanscheGrid(this.settings.gridSize)
  
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
    loadAssets(this.scene, (tasks) => {

      // load tile meshes
      const tileMeshes = tasks
        .filter((task) => {
          return task instanceof BABYLON.ContainerAssetTask && task.name.startsWith('tile')
        })
        .map((task) => (task as BABYLON.ContainerAssetTask))
        .reduce<TileMeshArray>((acc, task) => {
          const mesh = task.loadedContainer.instantiateModelsToScene(() => task.meshesNames).rootNodes[0] as BABYLON.Mesh
          mesh?.setEnabled(false)
          acc[task.meshesNames] =  mesh
          return acc
        }, {})
      tileManager.meshes = tileMeshes

      // load textures
      const textures = tasks
        .filter((task) => {
          return task instanceof BABYLON.TextureAssetTask
        })
        .map((task) => (task as BABYLON.TextureAssetTask))
        .reduce<TextureArray>((acc, task) => {
          acc[task.name] = task.texture
          return acc
        },{})
      tileManager.textures = textures

      // setup tiles
      tileManager.setup(this.settings.width, this.settings.height)

      // update tiles from current state
      tileManager.handleTileChange(this.stateMachine.state.tiles)
    })
  
    // call loop function
    const startTime = Date.now()
    this.scene.onBeforeRenderObservable.add(() => {
      loop(Date.now() - startTime)
    })
  
    // show axis
    // showAxis(10,this.scene)
    // showGroundPlane(20, this.scene,)

    createSkyBox(this.scene)
  
    // start render loop
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  
    // gets called before every render
    const simplex = new SimplexNoise()
    function loop(time: number) {
      // tileManager.tiles.forEach((tile,i) => {
      //   tile.position.y = simplex.noise2D(i,time * 0.0005) * 0.01
      // })
    }

    this.scene.onPrePointerObservable.add((pointerInfo) => {
      pointerInfo.skipOnPointerObservable = !this.enablePointerEvents
    })

    // cleanup when scene is disposes
    this.scene.onDisposeObservable.add(() => {
      tileManager.dispose()
    })

    // this.scene.debugLayer.show()

    applyPixelShader(this.scene, this.engine, this.camera)
  }

  resetCamera() : void {
    this.camera?.restoreState()
  }

  takeScreenshot() : void {
    if (this.camera)
      BABYLON.Tools.CreateScreenshot(this.engine, this.camera, 1280)
  }

  resize() : void {
    if (this.camera?.mode == BABYLON.Camera.ORTHOGRAPHIC_CAMERA) {
      const aspectRatio = this.engine.getAspectRatio(this.camera)
      this.camera.orthoLeft = -this.settings.camera.zoom * aspectRatio
      this.camera.orthoRight = this.settings.camera.zoom * aspectRatio
    }
    this.engine.resize()
  }
}

export { Playground }
export type { PlaygroundSettings }

