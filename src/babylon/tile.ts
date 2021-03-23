import { Mesh, Scene, MeshBuilder, Vector3, StandardMaterial, Color3, InstancedMesh, UtilityLayerRenderer, HemisphericLight } from '@babylonjs/core'
import _ from 'lodash'
import { Grid } from './grid'

class TileManager {

  tiles: Tile[]
  scene: Scene
  grid: Grid

  selectLayer : UtilityLayerRenderer
  selectMarker : Mesh

  constructor(scene: Scene, grid: Grid) {
    this.grid = grid
    this.scene = scene
    this.tiles = []

    this.selectLayer = new UtilityLayerRenderer(scene)
    this.selectMarker = MeshBuilder.CreateBox('marker-mesh', { size: 1.2, height: 0.01 }, this.selectLayer.utilityLayerScene)
    this._initUtilLayer()
  }

  _initUtilLayer() : void {
    new HemisphericLight('light1', new Vector3(0, 0, 1), this.selectLayer.utilityLayerScene)
    const material = new StandardMaterial('tileMaterial', this.selectLayer.utilityLayerScene)
    material.diffuseColor = new Color3(1,0,0)
    material.alpha = 0.6
    this.selectMarker.material = material
    this.selectMarker.position.y = 0.3

    this.selectMarker.setEnabled(false)
  }

  setup(width: number, height: number, mesh: Mesh) : void {

    // const material1 = 
    // material1.diffuseColor = new Color3(1,1,1)
    // material1.alpha = 1

    // const material2 = new StandardMaterial('tileMaterial', this.scene)
    // material2.diffuseColor = new Color3(1,0,0)
    // material2.alpha = 1

    this.tiles = this.grid.cells.map(([x,y], i) => {
      const tile = new Tile(`box${i}`, mesh, this.scene)
      tile.mesh.position = new Vector3(
        x * width - width/2, 
        0,
        y * height - height/2)
      tile.show()
      return tile
    })
  }

  selectTile(tileName: string|undefined) : void {
    const tile = this.tiles.find((t) => {
      return t.mesh.name == tileName
    })
    if (tile) {
      this.selectMarker.position.x = tile.mesh.position.x
      this.selectMarker.position.z = tile.mesh.position.z
      this.selectMarker.setEnabled(true)
    } else {
      this.selectMarker.setEnabled(false)
    }
  }
}

class Tile {
  mesh: InstancedMesh
  _scene: Scene

  constructor(name: string, mesh: Mesh, scene: Scene) {
    this._scene = scene

    this.mesh = mesh.createInstance(name)
    this.mesh.setEnabled(true)
    this.mesh.scaling = new Vector3(0.5, 0.5, 0.5)
    
    // const rotate = <number>_.sample([Math.PI, 0, Math.PI / 2, Math.PI * 1.5])
    // this.mesh.rotateAround(this.mesh.getPivotPoint().scale(0.5), new Vector3(0,1,0), rotate)
  }

  show() : void {
    this._scene.addMesh(this.mesh)
  }

  hide() : void {
    this._scene.removeMesh(this.mesh)
  }
}

export { Tile, TileManager }