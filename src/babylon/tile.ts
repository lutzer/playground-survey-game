import { Mesh, Scene, MeshBuilder, Vector3, StandardMaterial, Color3, UtilityLayerRenderer, HemisphericLight, TransformNode, PointerEventTypes, PointerInfo } from '@babylonjs/core'
import EventEmitter from 'events'
import _ from 'lodash'
import { concat, of, Subject } from 'rxjs'
import { map, switchMap, takeUntil, timeInterval, withLatestFrom } from 'rxjs/operators'
import { State } from '../state'
import { Grid } from './grid'

type TileType = 'grass'|'tree'|'swings'|'trampolin'|'slide'

type TileState = {
  type: TileType,
  rotation: number,
  index: number
}

type TileMeshArray = { [name : string] : Mesh }

class TileManager extends EventEmitter {

  tiles: Tile[]
  scene: Scene
  grid: Grid
  
  private _state: State

  private _selectLayer : UtilityLayerRenderer
  private _selectMarker : Mesh

  meshes: TileMeshArray

  enablePointerEvents: boolean

  //Observables
  $pointerDownObservable : Subject<PointerInfo>
  $pointerUpObservable : Subject<PointerInfo>
  $disposeObservable: Subject<void>

  constructor(scene: Scene, grid: Grid, state: State) {
    super()
    this.grid = grid
    this.scene = scene
    this.tiles = []

    this._state = state

    this.meshes = {}

    this.enablePointerEvents = true

    this.$pointerDownObservable = new Subject()
    this.$pointerUpObservable = new Subject()
    this.$disposeObservable = new Subject()

    // add pointer observables for tile picking
    this.scene.onPointerObservable.add( (pInfo) => {
      if (!this.enablePointerEvents)
        return
      if (pInfo.type == PointerEventTypes.POINTERDOWN)
        this.$pointerDownObservable.next(pInfo)
      else if (pInfo.type == PointerEventTypes.POINTERUP)
        this.$pointerUpObservable.next(pInfo)
    })

    this._selectLayer = new UtilityLayerRenderer(scene, false)
    this._selectMarker = MeshBuilder.CreateBox('marker-mesh', { width: 1.1, height: 0.1, depth: 1.1 }, this._selectLayer.utilityLayerScene)
    this._initUtilLayer()

  }

  dispose() {
    this.$disposeObservable.next()
  }

  _initUtilLayer() : void {
    new HemisphericLight('light1', new Vector3(0, 0, 1), this._selectLayer.utilityLayerScene)
    const material = new StandardMaterial('tileMaterial', this._selectLayer.utilityLayerScene)
    material.diffuseColor = new Color3(1,0,0)
    material.alpha = 0.5
    this._selectMarker.material = material
    this._selectLayer.shouldRender = true

    this._selectMarker.setEnabled(false)
    this._selectMarker.isPickable = false
    this._selectMarker.translate(new Vector3(0,1,0), 0.6)
    this._selectMarker.bakeCurrentTransformIntoVertices()

    const $onDownPicked = this.$pointerDownObservable.pipe(map((pInfo) => {
      const pick = this._selectLayer.utilityLayerScene.pick(pInfo.event.offsetX, pInfo.event.offsetY)
      return ({ pick: pick, time: Date.now()})
    }))

    const $onUpPicked = this.$pointerUpObservable.pipe(map((pInfo) => {
      const pick = this._selectLayer.utilityLayerScene.pick(pInfo.event.offsetX, pInfo.event.offsetY)
      return ({ pick: pick, time: Date.now()})
    }))

    // test if tile on down event is the same than on up event
    $onUpPicked.pipe(withLatestFrom($onDownPicked), takeUntil(this.$disposeObservable)).subscribe( ([up, down]) => {
      if (up.pick?.hit && up.pick?.pickedMesh?.name == down.pick?.pickedMesh?.name && up.time - down.time < 500) {
        this.emit('tile-selected', up.pick.pickedMesh?.metadata?.tileIndex)
      }
    })
  }

  setup(width: number, height: number) : void {
    // create tiles
    this.tiles = this.grid.cells.map(([x,y], i) => {
      const tile = new Tile(`box${i}`, this.meshes, this.scene)
      tile.position = new Vector3(
        x * width - width/2, 
        0,
        y * height - height/2)
      tile.type = this._state.tiles[i].type
      tile.rotation = this._state.tiles[i].rotation
      tile.show()
      return tile
    })

    // create hitboxes to select tiles
    this.grid.cells.map(([x,y], i) => {
      const box = MeshBuilder.CreateBox(`select_tile_${i}`, { size: 1 }, this._selectLayer.utilityLayerScene)
      box.metadata = { tileIndex : i }
      box.position = new Vector3(
        x * width - width/2, 
        0,
        y * height - height/2
      )
      box.visibility = 0
      box.isPickable = true
    })

    this.setSelectMarker(this._state.selectedTile)
  }

  handleTileChange(updatedtileStates : TileState[]) : void {
    const updatedTiles = _.differenceWith(updatedtileStates, this._state.tiles, _.isEqual)
    updatedTiles.forEach((tileState) => {
      this.tiles[tileState.index].type = tileState.type
      this.tiles[tileState.index].rotation = tileState.rotation
    })
    this._state.tiles = updatedtileStates
  }

  setSelectMarker(tileIndex: number | undefined) : void {
    if (tileIndex != undefined) {
      this._selectMarker.position = this.tiles[tileIndex].position
      // this._selectMarker.parent = this.tiles[tileIndex].node
      this._selectMarker.setEnabled(true)
    } else {
      this._selectMarker.setEnabled(false)
    }
  }
}

class Tile {
  node: TransformNode | null = null
  name: string
  
  private _position: Vector3
  private _rotation: number

  private _type: TileType | undefined
  private _meshes : TileMeshArray
  private _scene : Scene

  constructor(name: string, meshes: TileMeshArray, scene: Scene) {
    this.name = name
    this._meshes = meshes
    this._scene = scene

    this._position = new Vector3(0,0,0)
    this._rotation = 0
  }

  set type(type : TileType) {
    if (this._type == type)
      return
     
    // remove old mesh  
    if (this.node) {
      this.node.dispose()
    }

    this._type = type
    const mesh = this._meshes[type]
    this.node = mesh.instantiateHierarchy() || new TransformNode(this.name, this._scene)
   
    this.node.position = this._position
    this.node.setEnabled(true)
  }

  set rotation(rotation: number) {
    this.node?.rotate(new Vector3(0,1,0), rotation)
  }

  set position(position: Vector3) {
    this._position = position
    if (this.node)
      this.node.position = this._position
  }

  get position() : Vector3 {
    return this._position
  }

  show() : void {
    this.node?.setEnabled(true)
  }

  hide() : void {
    this.node?.setEnabled(false)
  }
}

export { Tile, TileManager }
export type { TileMeshArray, TileType, TileState }