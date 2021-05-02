import { ArcRotateCamera, Camera, Engine, Scene, UniversalCamera, Vector2, Vector3 } from '@babylonjs/core'
import { PointerEventTypes, PointerInfo } from '@babylonjs/core/Events/pointerEvents'
import { Observer } from '@babylonjs/core/Misc/observable'
import { Nullable } from '@babylonjs/core/types'
import { combineLatest, fromEvent, of, Subject } from 'rxjs'
import { switchMap, takeUntil } from 'rxjs/operators'

const MAX_DISTANCE = 20
const MIN_DISTANCE = 5

class PlaygroundCamera {

  private scene : Scene
  private canvas : HTMLCanvasElement

  private cursor : Vector3

  private aspectRatio : number

  camera : UniversalCamera

  private $disposeObservable: Subject<void>
  private pointerObserver : Nullable<Observer<PointerInfo>>

  constructor(scene: Scene, canvas: HTMLCanvasElement, zoom: number) {
    this.scene = scene
    this.canvas = canvas

    this.camera = new UniversalCamera('camera', new Vector3(10,10,10), scene)
    this.camera.mode = Camera.ORTHOGRAPHIC_CAMERA
    this.camera.setTarget(Vector3.Zero())

    this.cursor = new Vector3(0,0, zoom)

    this.aspectRatio = this.scene.getEngine().getAspectRatio(this.camera)

    this.onResize()

    this.$disposeObservable = new Subject()
    this.pointerObserver = null
  }

  dispose() {
    this.$disposeObservable.next()
    this.scene.onPointerObservable.remove(this.pointerObserver)
  }

  enableControl(enable: boolean) : void {
    this.$disposeObservable.next()
    this.scene.onPointerObservable.remove(this.pointerObserver)
    if (!enable)
      return

    const $pointerDownObservable = fromEvent<PointerEvent>(this.canvas,'pointerdown')
    const $pointerUpObservable = fromEvent<PointerEvent>(this.canvas,'pointerup')
    const $pointerMoveObservable = fromEvent<PointerEvent>(this.canvas,'pointermove')

    const $dragObservable = $pointerDownObservable.pipe(switchMap( (down) =>
      combineLatest([$pointerMoveObservable, of(down), of(this.cursor.clone())])
        .pipe(takeUntil($pointerUpObservable))
    ))

    $dragObservable.subscribe( ([move, down, cursor]) => {
      const dx = down.screenX - move.screenX
      const dy = down.screenY - move.screenY
      this.setCameraTarget(cursor.x + dx/50, cursor.y + dy/50)
    })
    
  }

  onResize() : void {
    this.aspectRatio = this.scene.getEngine().getAspectRatio(this.camera)
    this.update()
  }

  update() : void {
    const zoom = this.cursor.z
    this.camera.orthoTop = zoom - this.cursor.y
    this.camera.orthoBottom = -zoom - this.cursor.y
    this.camera.orthoRight = zoom * this.aspectRatio + this.cursor.x
    this.camera.orthoLeft = -zoom * this.aspectRatio + this.cursor.x
  }

  setCameraTarget(x : number,y : number) : void {
    this.cursor.x = x
    this.cursor.y = y
    this.update()
  }

  getCameraTarget() : [number, number] {
    return [this.cursor.x, this.cursor.y]
  }
}

export { PlaygroundCamera}