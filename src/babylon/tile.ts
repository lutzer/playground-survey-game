import { Mesh, Scene, MeshBuilder, Vector3, StandardMaterial, Color3, UtilityLayerRenderer, HemisphericLight, TransformNode, HighlightLayer, PointerEventTypes } from '@babylonjs/core'
import _ from 'lodash'
import { Grid } from './grid'

type TileType = 'grass'|'tree'|'swings'

type TileMeshArray = { [name : string] : Mesh }

class TileManager {

  tiles: Tile[]
  scene: Scene
  grid: Grid


  highlightLayer: HighlightLayer

  _selectLayer : UtilityLayerRenderer
  _selectMarker : Mesh
  _selectedTile : Tile | undefined 

  meshes: TileMeshArray

  enablePointerEvents: boolean

  constructor(scene: Scene, grid: Grid) {
    this.grid = grid
    this.scene = scene
    this.tiles = []

    this.meshes = {}

    this._selectLayer = new UtilityLayerRenderer(scene)

    this.highlightLayer = new HighlightLayer('highlight-tile', scene)

    this._selectMarker = MeshBuilder.CreateBox('marker-mesh', { size: 1.1 }, this._selectLayer.utilityLayerScene)
    this._initUtilLayer()

    this.enablePointerEvents = true
  }

  _initUtilLayer() : void {
    new HemisphericLight('light1', new Vector3(0, 0, 1), this._selectLayer.utilityLayerScene)
    const material = new StandardMaterial('tileMaterial', this._selectLayer.utilityLayerScene)
    material.diffuseColor = new Color3(1,0,0)
    material.alpha = 0.6
    this._selectMarker.material = material
    this._selectLayer.shouldRender = true

    this._selectMarker.setEnabled(false)
    this._selectMarker.translate(new Vector3(0,1,0), 0.3)
    this._selectMarker.bakeCurrentTransformIntoVertices()

    // disables pointer events if necessary
    this._selectLayer.utilityLayerScene.onPrePointerObservable.add((pointerInfo) => {
      pointerInfo.skipOnPointerObservable = 
        pointerInfo.type != PointerEventTypes.POINTERDOWN ||
        !this.enablePointerEvents
    })

    // mouse and touch events
    this._selectLayer.utilityLayerScene.onPointerObservable.add((pointerInfo) => {   
      if (pointerInfo.pickInfo?.hit)
        this.selectTile(pointerInfo.pickInfo.pickedMesh?.metadata)
      else
        this.selectTile()
    })
  }

  setup(width: number, height: number) : void {
    // create tiles
    this.tiles = this.grid.cells.map(([x,y], i) => {
      const position = new Vector3(
        x * width - width/2, 
        0,
        y * height - height/2)
      const tile = new Tile(`box${i}`, position, 'grass', this.meshes, this.scene)
      if (tile.node)
        tile.node.position = new Vector3(
          x * width - width/2, 
          0,
          y * height - height/2)
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
    })
  }

  selectTile(hitBoxMetadata?: any) : void {
    if (hitBoxMetadata && hitBoxMetadata.tileIndex) {
      this._selectMarker.position = this.tiles[hitBoxMetadata.tileIndex].position
      this._selectMarker.setEnabled(true)
      this._selectedTile = this.tiles[hitBoxMetadata.tileIndex]
      this._selectedTile.type = 'tree'
    } else {
      this._selectMarker.setEnabled(false)
      this._selectedTile = undefined
    }
  }
}

class Tile {
  node: TransformNode | null = null
  name: string
  
  position: Vector3

  _type: TileType | null = null
  _meshes : TileMeshArray
  _scene : Scene

  constructor(name: string, position: Vector3, type: TileType, meshes: TileMeshArray, scene: Scene) {
    this.name = name
    this._meshes = meshes
    this._scene = scene
    
    this.type = type

    this.position = position
  }

  set type(type : TileType) {
    if (this.node) {
      this.node.dispose()
    }

    this._type = type
    const mesh = this._meshes[type]
    if (mesh) {
      this.node = mesh.instantiateHierarchy()
    } else {
      this.node = new TransformNode(this.name, this._scene)
    }

    if (this.node) {
      this.node.position = this.position
      this.node.setEnabled(true)
  
      // randomly rotate
      const rotate = <number>_.sample([Math.PI, 0, Math.PI / 2, Math.PI * 1.5])
      this.node.rotate(new Vector3(0,1,0), rotate)
    }
  }

  show() : void {
    this.node?.setEnabled(true)
  }

  hide() : void {
    this.node?.setEnabled(false)
  }
}

export { Tile, TileManager }
export type { TileMeshArray }