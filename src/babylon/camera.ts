import { Camera, Scene, UniversalCamera, Vector3 } from '@babylonjs/core'
import { PointerInfo } from '@babylonjs/core/Events/pointerEvents'
import { Observer } from '@babylonjs/core/Misc/observable'
import { Nullable } from '@babylonjs/core/types'
import { combineLatest, fromEvent, of, Subject, merge } from 'rxjs'
import { filter, switchMap, takeUntil } from 'rxjs/operators'

import Hammer from 'hammerjs'
import { fromHammerEvent } from './helpers'

const MAX_ZOOM = 10
const MIN_ZOOM = 1

const MAX_X = 4
const MAX_Y = 4

const DISTANCE = 10

class OrthographicCamera {

  private scene : Scene
  private canvas : HTMLCanvasElement

  private cursor : Vector3

  private aspectRatio : number
  private _rotation = 0

  camera : UniversalCamera

  private $disposeObservable: Subject<void>
  private pointerObserver : Nullable<Observer<PointerInfo>>

  constructor(scene: Scene, canvas: HTMLCanvasElement, zoom: number) {
    this.scene = scene
    this.canvas = canvas

    this.cursor = new Vector3(0,0, zoom)

    this.camera = new UniversalCamera('camera', new Vector3(0,0,0), scene)
    this.camera.mode = Camera.ORTHOGRAPHIC_CAMERA
    this.rotation = Math.PI / 4


    this.aspectRatio = this.scene.getEngine().getAspectRatio(this.camera)

    this.update()

    this.$disposeObservable = new Subject()
    this.pointerObserver = null

    // pointer.on('pan', (e) => {
    //   console.log('Fired when the `element` is being panned', e)
    // })
  }

  dispose() {
    this.$disposeObservable.next()
    this.scene.onPointerObservable.remove(this.pointerObserver)
  }

  enableControl() : void {

    const mc = new Hammer(this.canvas)
    mc.get('pinch').set({ enable: true, threshold: 0 })

    const $pinchStart = fromHammerEvent(mc, 'pinchstart')
    const $pinchEnd = fromHammerEvent(mc, 'pinchend')
    const $pinchMove = fromHammerEvent(mc, 'pinchmove')

    const $pinchObservable = $pinchStart.pipe(switchMap( () =>
      combineLatest([$pinchMove, of(this.cursor.clone())])
        .pipe(takeUntil($pinchEnd))
    ), takeUntil(this.$disposeObservable))

    $pinchObservable.subscribe(([move, cursor]) => {
      this.zoom = cursor.z / move.scale
    })

    const $pointerDown = fromEvent<PointerEvent>(this.canvas,'pointerdown').pipe(filter((e) => e.isPrimary))
    const $pointerUp = fromEvent<PointerEvent>(this.canvas,'pointerup').pipe(filter((e) => e.isPrimary))
    const $pointerMove = fromEvent<PointerEvent>(this.canvas,'pointermove').pipe(filter((e) => e.isPrimary))
    const $pointerDownMultiple = fromEvent<PointerEvent>(this.canvas,'pointerdown').pipe(filter((e) => !e.isPrimary))

    const $dragObservable = $pointerDown.pipe(switchMap( (down) =>
      combineLatest([$pointerMove, of(down), of(this.cursor.clone())])
        .pipe(takeUntil(merge($pointerUp,$pointerDownMultiple)))
    ), takeUntil(this.$disposeObservable))

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
    // this.camera.position.x = x + Math.cos(this._rotation) * 10 
    // this.camera.position.z = y + Math.sin(this._rotation) * 10 

    // this.camera.setTarget(new Vector3(x,0,y))

    this.cursor.x = Math.max(-MAX_X, Math.min(MAX_X, x))
    this.cursor.y = Math.max(-MAX_Y, Math.min(MAX_Y, y))
    this.update()
  }

  set rotation(angle : number) {
    this._rotation = (angle + 2*Math.PI) % (2*Math.PI)
    this.camera.position = new Vector3(Math.cos(angle) * 10, 10, Math.sin(angle) * 10)
    this.camera.setTarget(Vector3.Zero())
  }

  get rotation() : number {
    return this._rotation
  }

  rotateLeft() {
    this.rotation -= Math.PI / 2 
  }

  rotateRight() {
    this.rotation += Math.PI / 2
  }

  set zoom(zoom: number) {
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