import { Mesh, Scene, MeshBuilder, Vector3, StandardMaterial, Color3, UtilityLayerRenderer, HemisphericLight, TransformNode, PointerEventTypes, PointerInfo, Texture } from '@babylonjs/core'
import { Engine } from '@babylonjs/core/Engines/engine'
import EventEmitter from 'events'
import _ from 'lodash'
import { Subject } from 'rxjs'
import { map, takeUntil, withLatestFrom } from 'rxjs/operators'
import { SelectableTiles, TileType } from './assets'
import { Grid } from './grid'
import { TextureArray, Tile, TileMeshArray, TileState } from './tiles'

const TILE_PICK_CLICK_TIMEOUT = 300

class TileCursor {

  private _selectLayer : UtilityLayerRenderer
  private _selectMarker : Mesh

  constructor(utilLayer: UtilityLayerRenderer) {
    this._selectLayer = utilLayer
    this._selectMarker = MeshBuilder.CreateBox('marker-mesh', { width: 1.1, height: 0.01, depth: 1.1 }, this._selectLayer.utilityLayerScene)

    const material = new StandardMaterial('tileMaterial', this._selectLayer.utilityLayerScene)
    material.diffuseColor = new Color3(0.5, 0.5, 0.5)
    material.specularColor = new Color3(0.5, 0.5, 0.5)
    material.alpha = 0.99
    material.alphaMode = Engine.ALPHA_MAXIMIZED
    this._selectMarker.material = material
    this._selectLayer.shouldRender = true

    this._selectMarker.setEnabled(false)
    this._selectMarker.isPickable = false
    this._selectMarker.translate(new Vector3(0,1,0), 0.73)
    this._selectMarker.bakeCurrentTransformIntoVertices()
  }

  set enable(enable : boolean) {
    this._selectMarker.setEnabled(enable)
  }

  set position(pos: Vector3) {
    this._selectMarker.position = pos
  }
}

class TileManager extends EventEmitter {

  tiles: Tile[]
  scene: Scene
  grid: Grid

  private _selectLayer : UtilityLayerRenderer
  private _cursor : TileCursor

  private _assets : { meshes: TileMeshArray, textures: TextureArray }

  //Observables
  $pointerDownObservable : Subject<PointerInfo>
  $pointerUpObservable : Subject<PointerInfo>
  $disposeObservable: Subject<void>

  constructor(scene: Scene, grid: Grid) {
    super()
    this.grid = grid
    this.scene = scene
    this.tiles = []

    this._assets = { meshes: {}, textures: {}}

    this.$pointerDownObservable = new Subject()
    this.$pointerUpObservable = new Subject()
    this.$disposeObservable = new Subject()

    this._selectLayer = new UtilityLayerRenderer(scene, false)
    new HemisphericLight('light1', new Vector3(0, 0, 1), this._selectLayer.utilityLayerScene)
    this._cursor = new TileCursor(this._selectLayer)
    
    this.setupPointerObservables()
  }

  dispose() : void {
    this.$disposeObservable.next()
  }

  set meshes(meshes: TileMeshArray ) {
    this._assets.meshes = meshes
  }

  set textures(textures: TextureArray) {
    this._assets.textures = textures
  }

  setupPointerObservables() : void {

    // add pointer observables for tile picking
    this.scene.onPointerObservable.add( (pInfo) => {
      if (pInfo.type == PointerEventTypes.POINTERDOWN)
        this.$pointerDownObservable.next(pInfo)
      else if (pInfo.type == PointerEventTypes.POINTERUP)
        this.$pointerUpObservable.next(pInfo)
    })

    const $onDownPicked = this.$pointerDownObservable.pipe(map((pInfo) => {
      const pick = this._selectLayer.utilityLayerScene.pick(pInfo.event.offsetX, pInfo.event.offsetY)
      return ({ pick: pick, event: pInfo.event, time: Date.now()})
    }))

    const $onUpPicked = this.$pointerUpObservable.pipe(map((pInfo) => {
      const pick = this._selectLayer.utilityLayerScene.pick(pInfo.event.offsetX, pInfo.event.offsetY)
      return ({ pick: pick, event: pInfo.event, time: Date.now()})
    }))

    // test if tile on down event is the same than on up event
    $onUpPicked.pipe(withLatestFrom($onDownPicked), takeUntil(this.$disposeObservable)).subscribe( ([up, down]) => {
      const dist = Math.abs(up.event.screenX - down.event.screenX) + Math.abs(up.event.screenY - down.event.screenY)
      if (up.pick?.hit && up.pick?.pickedMesh?.name == down.pick?.pickedMesh?.name && dist < 10) {
        this.emit('tile-selected', up.pick.pickedMesh?.metadata?.tileIndex)
      }
    })
  }

  setup(width: number, height: number) : void {
    // create tiles
    this.tiles = this.grid.cells.map(({position, fixedTile}, i) => {
      const tile = new Tile(`tile${i}`, this._assets.meshes, this._assets.textures, this.scene)
      
      tile.position = new Vector3(position[0] * width - width/2,  0, position[1] * height - height/2)
      
      tile.type = fixedTile || SelectableTiles.grass
      
      tile.rotation = 0
      tile.show()
      return tile
    })

    // create hitboxes to select tiles
    this.grid.cells.forEach(({position, fixedTile}, i) => {
      if (fixedTile)
        return

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
      if (this.tiles[tileState.index].selectable) {
        this.tiles[tileState.index].type = tileState.type
        this.tiles[tileState.index].rotation = tileState.rotation
      }
    })
  }

  setSelectMarker(tileIndex: number | undefined) : void {
    if (tileIndex != undefined) {
      this._cursor.position = this.tiles[tileIndex].position
      this._cursor.enable = true
    } else {
      this._cursor.enable = false
    }
  }
}

export { TileManager }