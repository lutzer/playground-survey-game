import { AnimationGroup } from '@babylonjs/core/Animations/animationGroup'
import { Vector3 } from '@babylonjs/core/Maths/math'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { TransformNode } from '@babylonjs/core/Meshes/transformNode'
import { Scene } from '@babylonjs/core/scene'
import { FixedTiles, SelectableTiles, TextureArray, TileMeshArray, TileType } from './assets'
import { Fountain, PlaygroundEffect, WaterLight } from './effects'

type TileState = {
  type: TileType,
  rotation: number,
  index: number
}

class Tile {
  node: TransformNode
  name: string
  
  private _position: Vector3

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
  }

  dispose() : void {
    this.node?.dispose()
    this._effects.forEach((e) => e.dispose())
    this._effects = []
    this._animation?.dispose()
  }

  set type(type : TileType) {
    if (this._type == type)
      return
    this._type = type
     
    // remove old mesh and effects
    this.dispose()

    // add effects depending on tiles
    if (type == FixedTiles.pool ) {
      this._effects.push(new Fountain(this.node.getAbsolutePosition().add(new Vector3(0.01, 1.1, 0.01)), this._textures['texture-fountain'], this._scene))
      this._effects.push(new WaterLight(this.node.getAbsolutePosition().add(new Vector3(0, 2, 0)), this._scene))
    } else if ( type == FixedTiles.river ) {
      this._effects.push(new WaterLight(this.node.getAbsolutePosition().add(new Vector3(-1, 2.5, -0.5)), this._scene))
      this._effects.push(new WaterLight(this.node.getAbsolutePosition().add(new Vector3(1, 3.0, -1)), this._scene))
      this._effects.push(new WaterLight(this.node.getAbsolutePosition().add(new Vector3(-2, 1.5, -1)), this._scene))
    }

    // instanciate new mesh keeping the same name
    const mesh = <Mesh>this._meshes[type]?.mesh?.instantiateHierarchy(undefined, undefined, (src, clone) => {
      clone.name = src.name
    })

    // attach animations to target nodes
    this._meshes[type]?.animations?.forEach(({anim, target, fixedSpeed}) => {
      this._animation = new AnimationGroup(this.name, this._scene)
      const targetNode = mesh.getChildren(undefined, false).find((node) => {
        return node.name == target
      })
      if (targetNode) {
        this._animation.addTargetedAnimation(anim, targetNode)
        const speed = fixedSpeed ? undefined : Math.random() * 0.5 + 0.5
        this._animation.start(true, speed)
      }
    })
    // performance optimization
    if (mesh) mesh.doNotSyncBoundingInfo = true

    this.node = mesh || new TransformNode(this.name, this._scene)
   
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

  get selectable() : boolean {
    return Object.keys(SelectableTiles).includes(this._type as string)
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