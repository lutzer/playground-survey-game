import { Camera, Scene, UniversalCamera, Vector3 } from '@babylonjs/core'
import { PointerInfo } from '@babylonjs/core/Events/pointerEvents'
import { Observer } from '@babylonjs/core/Misc/observable'
import { Nullable } from '@babylonjs/core/types'
import { combineLatest, fromEvent, of, Subject } from 'rxjs'
import { switchMap, takeUntil } from 'rxjs/operators'

// import panzoom from 'panzoom'

const MAX_ZOOM = 10
const MIN_ZOOM = 1

const MAX_X = 4
const MAX_Y = 4

class OrthographicCamera {

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

    this.update()

    this.$disposeObservable = new Subject()
    this.pointerObserver = null

    // const pointer = panzoom(this.canvas)

    // pointer.on('pan', (e) => {
    //   console.log('Fired when the `element` is being panned', e)
    // })
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
      const zoomDivisor = 80 * 5/cursor.z
      this.setCameraCenter(cursor.x + dx/zoomDivisor, cursor.y + dy/zoomDivisor)
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

  setCameraCenter(x : number,y : number) : void {
    this.cursor.x = Math.max(-MAX_X, Math.min(MAX_X, x))
    this.cursor.y = Math.max(-MAX_Y, Math.min(MAX_Y, y))
    this.update()
  }

  set zoom(zoom: number) {
    console.log(zoom)
    this.cursor.z = Math.max( MIN_ZOOM, Math.min(MAX_ZOOM, zoom))
    this.update()
  }

  get zoom() : number {
    return this.cursor.z
  }

  getCameraTarget() : [number, number] {
    return [this.cursor.x, this.cursor.y]
  }
}

export { OrthographicCamera}