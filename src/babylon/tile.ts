import { Mesh, Scene, MeshBuilder, Vector3 } from '@babylonjs/core'

class Tile {
  mesh : Mesh
  scene : Scene

  constructor(name: string, scene: Scene) {
    this.scene = scene
    this.mesh = MeshBuilder.CreateBox(name, {})
  }

  set pos(p: Vector3) {
    this.mesh.position.x = p.x
    this.mesh.position.y = p.y
    this.mesh.position.z = p.z
  }

  show() : void {
    this.scene.addMesh(this.mesh)
  }

  hide() : void {
    this.scene.removeMesh(this.mesh)
  }
}

export { Tile }