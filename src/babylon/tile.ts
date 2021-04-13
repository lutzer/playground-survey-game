import { Mesh, Scene, MeshBuilder, Vector3, StandardMaterial, Color3, UtilityLayerRenderer, HemisphericLight, TransformNode, PointerEventTypes, PointerInfo, Texture } from '@babylonjs/core'
import EventEmitter from 'events'
import _ from 'lodash'
import { Subject } from 'rxjs'
import { map, takeUntil, withLatestFrom } from 'rxjs/operators'
import { TileType } from './assets'
import { Fountain, PlaygroundEffect } from './effects'
import { Grid } from './grid'
import { getNodeChildren } from './helpers'

const TILE_PICK_CLICK_TIMEOUT = 400

type TileState = {
  type: TileType,
  rotation: number,
  index: number
}

type TileMeshArray = { [name : string] : Mesh }
type TextureArray = { [name : string] : Texture }

class TileManager extends EventEmitter {

  tiles: Tile[]
  scene: Scene
  grid: Grid

  private _selectLayer : UtilityLayerRenderer
  private _selectMarker : Mesh

  private _meshes: TileMeshArray
  private _textures : TextureArray

  //Observables
  $pointerDownObservable : Subject<PointerInfo>
  $pointerUpObservable : Subject<PointerInfo>
  $disposeObservable: Subject<void>

  constructor(scene: Scene, grid: Grid) {
    super()
    this.grid = grid
    this.scene = scene
    this.tiles = []

    this._meshes = {}
    this._textures = {}

    this.$pointerDownObservable = new Subject()
    this.$pointerUpObservable = new Subject()
    this.$disposeObservable = new Subject()

    // add pointer observables for tile picking
    this.scene.onPointerObservable.add( (pInfo) => {
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

  set meshes(meshes: TileMeshArray ) {
    this._meshes = meshes
  }

  set textures(textures: TextureArray) {
    this._textures = textures
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
      if (up.pick?.hit && up.pick?.pickedMesh?.name == down.pick?.pickedMesh?.name && up.time - down.time < TILE_PICK_CLICK_TIMEOUT) {
        this.emit('tile-selected', up.pick.pickedMesh?.metadata?.tileIndex)
      }
    })
  }

  setup(width: number, height: number) : void {
    // create tiles
    this.tiles = this.grid.cells.map(({position, fixedTile}, i) => {
      const tile = new Tile(`tile${i}`, this._meshes, this._textures, this.scene)
      tile.position = new Vector3(
        position[0] * width - width/2, 
        0,
        position[1] * height - height/2)
      tile.type = fixedTile || 'grass'
      tile.rotation = 0
      tile.fixed = fixedTile != null
      tile.show()
      return tile
    })

    // create hitboxes to select tiles
    this.grid.cells.map(({position, fixedTile}, i) => {
      const box = MeshBuilder.CreateBox(`select_tile_${i}`, { size: 1 }, this._selectLayer.utilityLayerScene)
      box.metadata = { tileIndex : i, selectable: fixedTile == null }
      box.position = new Vector3(
        position[0] * width - width/2, 
        0,
        position[1] * height - height/2
      )
      box.visibility = 0
      box.isPickable = true
    })
  }

  handleTileChange(currState: TileState[], prevState? : TileState[]) : void {
    const updatedTiles = prevState ? _.differenceWith(prevState, currState, _.isEqual) : currState
    updatedTiles.forEach((tileState) => {
      if (!this.tiles[tileState.index].fixed) {
        this.tiles[tileState.index].type = tileState.type
        this.tiles[tileState.index].rotation = tileState.rotation
      }
    })
  }

  setSelectMarker(tileIndex: number | undefined) : void {
    if (tileIndex != undefined && !this.tiles[tileIndex].fixed) {
      this._selectMarker.position = this.tiles[tileIndex].position
      this._selectMarker.setEnabled(true)
    } else {
      this._selectMarker.setEnabled(false)
    }
  }
}

class Tile {
  node: TransformNode
  name: string

  fixed: boolean //indicates if tile cant be change
  
  private _position: Vector3

  private _mesh : TransformNode | undefined

  private _type: TileType | undefined

  private _meshes : TileMeshArray
  private _textures : TextureArray

  private _scene : Scene

  private _effects : PlaygroundEffect[] = []

  constructor(name: string, meshes: TileMeshArray, textures: TextureArray, scene: Scene) {
    this.name = name
    this._meshes = meshes
    this._textures = textures
    this._scene = scene

    this._position = new Vector3(0,0,0)

    this.node = new TransformNode(name, scene, true)

    this.fixed = false
  }

  dispose() : void {
    this.node?.dispose()
    this._effects.forEach((e) => e.dispose())
    this._effects = []
  }

  set type(type : TileType) {
    if (this._type == type)
      return
    this._type = type
     
    // remove old mesh and effects
    this.dispose()

    if (type == 'pool5') {
      this._effects.push(new Fountain(this.node.absolutePosition.add(new Vector3(0.135,0.8,0.02)), this._textures['texture-fountain'], this._scene))
    }

    // instanciate new mesh
    this.node = this._meshes[type]?.instantiateHierarchy() || new TransformNode(this.name, this._scene)
    this.node.name = this.name
   
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
    this.node.setEnabled(true)
  }

  hide() : void {
    this.node.setEnabled(false)
  }
}

export { Tile, TileManager }
export type { TileMeshArray, TileType, TileState, TextureArray }