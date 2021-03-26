import { Mesh, Scene, MeshBuilder, Vector3, StandardMaterial, Color3, UtilityLayerRenderer, HemisphericLight, TransformNode } from '@babylonjs/core'
import _ from 'lodash'
import { Grid } from './grid'

type TileType = 'grass'|'tree'

class TileManager {

  tiles: Tile[]
  scene: Scene
  grid: Grid

  selectLayer : UtilityLayerRenderer
  selectMarker : Mesh

  meshes: Mesh[]

  constructor(scene: Scene, grid: Grid) {
    this.grid = grid
    this.scene = scene
    this.tiles = []

    this.meshes = []

    this.selectLayer = new UtilityLayerRenderer(scene)
    this.selectMarker = MeshBuilder.CreateBox('marker-mesh', { size: 1.1 }, this.selectLayer.utilityLayerScene)
    this._initUtilLayer()
  }

  _initUtilLayer() : void {
    new HemisphericLight('light1', new Vector3(0, 0, 1), this.selectLayer.utilityLayerScene)
    const material = new StandardMaterial('tileMaterial', this.selectLayer.utilityLayerScene)
    material.diffuseColor = new Color3(1,0,0)
    material.alpha = 0.6
    this.selectMarker.material = material
    this.selectMarker.setEnabled(false)
  }

  onTileLoaded(mesh: Mesh, type: TileType) {
    this.meshes.push(mesh)
  }

  setup(width: number, height: number, mesh: Mesh) : void {

    // const clone = mesh.clone('root')

    this.tiles = this.grid.cells.map(([x,y], i) => {
      const tile = new Tile(`box${i}`, 'grass', mesh, this.scene)
      if (tile.node)
        tile.node.position = new Vector3(
          x * width - width/2, 
          0,
          y * height - height/2)
      tile.show()
      return tile
    })
  }

  selectTile(tileName: string|undefined) : void {
    const tile = this.tiles.find((t) => {
      return t.node?.name == tileName
    })
    if (tile) {
      this.selectMarker.parent = tile.node
      this.selectMarker.setEnabled(true)
    } else {
      this.selectMarker.setEnabled(false)
    }
  }
}

class Tile {
  node: TransformNode | null
  _scene: Scene

  constructor(name: string, type: TileType, mesh: Mesh, scene: Scene) {
    this._scene = scene

    this.node = mesh.instantiateHierarchy()
    this.node?.name == name
    this.node?.setEnabled(true)
    
    // randomly rotate
    const rotate = <number>_.sample([Math.PI, 0, Math.PI / 2, Math.PI * 1.5])
    this.node?.rotateAround(this.node.getPivotPoint().scale(0.5), new Vector3(0,1,0), rotate)
  }

  show() : void {
    this.node?.setEnabled(true)
  }

  hide() : void {
    this.node?.setEnabled(false)
  }
}

export { Tile, TileManager }