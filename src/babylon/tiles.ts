import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import { Vector3 } from '@babylonjs/core/Maths/math'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { TransformNode } from '@babylonjs/core/Meshes/transformNode'
import { Scene } from '@babylonjs/core/scene'
import { FixedTiles, SelectableTiles, TileType } from './assets'
import { Fountain, PlaygroundEffect, WaterLight } from './effects'
import { Animation, AnimationGroup } from '@babylonjs/core'

type TileState = {
  type: TileType,
  rotation: number,
  index: number
}

type TileMeshArray = { [name : string] : { mesh: Mesh, animations: { target: string, anim: Animation }[] } }
type TextureArray = { [name : string] : Texture }

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

  private _animation : AnimationGroup | undefined;

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

    if (type == FixedTiles.pool ) {
      this._effects.push(new Fountain(this.node.absolutePosition.add(new Vector3(0.01, 1.1, 0.01)), this._textures['texture-fountain'], this._scene))
      this._effects.push(new WaterLight(this.node.absolutePosition.add(new Vector3(0, 2, 0)), this._scene))
    }

    // instanciate new mesh
    const mesh = <Mesh>this._meshes[type]?.mesh.instantiateHierarchy(undefined, undefined, (src, clone) => {
      clone.name = src.name
    })

    // attach all animations
    this._meshes[type]?.animations.forEach(({anim, target}) => {
      console.log(target)
      const animationGroup = new AnimationGroup(this.name, this._scene)
      const targetNode = mesh.getChildren((node) => {
        return node.name == target
      }, false)
      animationGroup.addTargetedAnimation(anim, targetNode[0])
      animationGroup.start(true)
    })
    if (mesh) mesh.doNotSyncBoundingInfo = true
    this.node = mesh || new TransformNode(this.name, this._scene)
    
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

export { Tile }
export type { TileMeshArray, TextureArray, TileState }