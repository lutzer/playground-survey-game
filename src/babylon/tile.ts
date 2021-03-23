import { Mesh, Scene, MeshBuilder, Vector3, Material, StandardMaterial, Color3, InstancedMesh } from '@babylonjs/core'
import { Grid } from './grid'

class TileManager {

  tiles: Tile[]
  scene: Scene
  grid: Grid

  constructor(scene: Scene, grid: Grid) {
    this.grid = grid
    this.scene = scene
    this.tiles = []
  }

  setup(width: number, height: number, mesh: Mesh) : void {

    const material1 = new StandardMaterial('tileMaterial', this.scene)
    material1.diffuseColor = new Color3(1,1,1)
    material1.alpha = 1

    const material2 = new StandardMaterial('tileMaterial', this.scene)
    material2.diffuseColor = new Color3(1,0,0)
    material2.alpha = 1

    this.tiles = this.grid.cells.map(([x,y], i) => {
      const tile = new Tile(`box${i}`, mesh, material1, material2, this.scene)
      tile.mesh.position = new Vector3(
        x * width - width/2, 
        0,
        y * height - height/2)
      tile.show()
      return tile
    })
  }

  selectTile(tileName: string|undefined) : void {
    this.tiles.forEach((tile) => {
      tile.select(tile.mesh.name == tileName)
    })
  }
}

class Tile {
  mesh: Mesh
  _scene: Scene
  _standardMaterial : Material
  _selectMaterial : Material

  constructor(name: string, mesh: Mesh, standardMaterial: Material, selectMaterial: Material, scene: Scene) {
    this._scene = scene

    this.mesh = mesh.clone()
    this.mesh.name = name
    this.mesh.scaling = new Vector3(0.5, 0.5, 0.5)

    this._standardMaterial = standardMaterial
    this._selectMaterial = selectMaterial

    this.select(false)
  }

  show() : void {
    this._scene.addMesh(this.mesh)
  }

  hide() : void {
    this._scene.removeMesh(this.mesh)
  }

  select(selected: boolean) : void {
    this.mesh.material = selected ? this._selectMaterial : this._standardMaterial
  }
}

export { Tile, TileManager }