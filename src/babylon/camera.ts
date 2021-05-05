import { AttachToBoxBehavior, Camera, Matrix, Scene, UniversalCamera, Vector2, Vector3 } from '@babylonjs/core'
import { PointerInfo } from '@babylonjs/core/Events/pointerEvents'
import { Observer } from '@babylonjs/core/Misc/observable'
import { Nullable } from '@babylonjs/core/types'
import { combineLatest, fromEvent, of, Subject, merge } from 'rxjs'
import { filter, switchMap, takeUntil } from 'rxjs/operators'

import Hammer from 'hammerjs'
import { animateValue, fromHammerEvent } from './utils'

const MAX_ZOOM = 10
const MIN_ZOOM = 1

const MAX_X = 4
const MAX_Y = 4

const DISTANCE = 10

function multiplyMatrixAndPoint(matrix : [number, number, number, number], point : [number, number]) : [number, number] {
  return [ point[0] * matrix[0] + point[1] * matrix[1], point[0] * matrix[2] + point[1] * matrix[3] ]
}

class OrthographicCamera {

  private scene : Scene
  private canvas : HTMLCanvasElement

  private _cursor : Vector2
  private _zoom : number

  private aspectRatio : number
  private _rotation : number

  camera : UniversalCamera

  private $disposeObservable: Subject<void>

  private _isAnimating = false

  constructor(scene: Scene, canvas: HTMLCanvasElement, zoom: number) {
    this.scene = scene
    this.canvas = canvas

    this._cursor = new Vector2(0,0)
    this._zoom = zoom
    this._rotation = Math.PI / 4

    this.camera = new UniversalCamera('camera', new Vector3(0,DISTANCE,0), scene)
    this.camera.mode = Camera.ORTHOGRAPHIC_CAMERA

    this.aspectRatio = this.scene.getEngine().getAspectRatio(this.camera)

    this.updateCameraFrame()
    this.updateCameraPosition()

    this.$disposeObservable = new Subject()
  }

  dispose() {
    this.$disposeObservable.next()
  }

  enableControl() : void {

    // react to pinching
    const mc = new Hammer(this.canvas)
    mc.get('pinch').set({ enable: true, threshold: 0 })

    const $pinchStart = fromHammerEvent(mc, 'pinchstart')
    const $pinchEnd = fromHammerEvent(mc, 'pinchend')
    const $pinchMove = fromHammerEvent(mc, 'pinchmove')

    const $pinchObservable = $pinchStart.pipe(switchMap( () =>
      combineLatest([$pinchMove, of(this._zoom)])
        .pipe(takeUntil($pinchEnd))
    ), takeUntil(this.$disposeObservable))

    $pinchObservable.subscribe(([move, zoom]) => {
      this.zoom = zoom / move.scale
    })

    // react to scrolling
    const $pointerDown = fromEvent<PointerEvent>(this.canvas,'pointerdown').pipe(filter((e) => e.isPrimary))
    const $pointerUp = fromEvent<PointerEvent>(this.canvas,'pointerup').pipe(filter((e) => e.isPrimary))
    const $pointerMove = fromEvent<PointerEvent>(this.canvas,'pointermove').pipe(filter((e) => e.isPrimary))
    const $pointerDownMultiple = fromEvent<PointerEvent>(this.canvas,'pointerdown').pipe(filter((e) => !e.isPrimary))

    const $dragObservable = $pointerDown.pipe(switchMap( (down) =>
      combineLatest([$pointerMove, of(down), of(this._cursor.clone())])
        .pipe(takeUntil(merge($pointerUp,$pointerDownMultiple)))
    ), takeUntil(this.$disposeObservable))

    $dragObservable.subscribe( ([move, down, cursor]) => {
      const dx = down.screenX - move.screenX
      const dy = down.screenY - move.screenY
      
      const mat = this.getRotationMatrix()
      const dvec = multiplyMatrixAndPoint(mat, [dy, dx])
      const zoomDivisor = 70 * 6/this.zoom

      this.setCameraCenter(cursor.x + dvec[0]/zoomDivisor, cursor.y + dvec[1]/zoomDivisor)
    })

    // react to mousewheel
    const $wheelTurn = fromEvent<WheelEvent>(window,'wheel')
    $wheelTurn.subscribe( (e) => {
      this.zoom -= Math.sign(e.deltaY) * 0.5
    })
    
  }

  onResize() : void {
    this.aspectRatio = this.scene.getEngine().getAspectRatio(this.camera)
    this.updateCameraFrame()
  }

  updateCameraFrame() : void {
    this.camera.orthoTop = this._zoom
    this.camera.orthoBottom = -this._zoom
    this.camera.orthoRight = this._zoom * this.aspectRatio
    this.camera.orthoLeft = -this._zoom * this.aspectRatio
  }

  updateCameraPosition() : void {
    this.camera.position.x = this._cursor.x + Math.cos(this._rotation) * DISTANCE
    this.camera.position.z = this._cursor.y + Math.sin(this._rotation) * DISTANCE
    this.camera.setTarget(new Vector3(this._cursor.x,0,this._cursor.y))
  }

  setCameraCenter(x : number,y : number) : void {
    x = Math.max(-MAX_X, Math.min(MAX_X, x))
    y = Math.max(-MAX_Y, Math.min(MAX_Y, y))

    this._cursor.x = x
    this._cursor.y = y

    this.updateCameraPosition()
  }

  getRotationMatrix() : [number, number, number, number] {
    return [
      Math.cos(this._rotation), -Math.sin(this._rotation),
      Math.sin(this._rotation), Math.cos(this._rotation),
    ]
  }

  set rotation(angle : number) {
    this._rotation = angle
    this.updateCameraPosition()
  }

  get rotation() : number {
    return this._rotation
  }

  rotateLeft() : void {
    if (this._isAnimating) return
    animateValue(this._rotation, this._rotation - Math.PI/2, 500, undefined, (v, done) => {
      this.rotation = v
      this._isAnimating = !done
    })
  }

  rotateRight() : void {
    if (this._isAnimating) return
    animateValue(this._rotation, this._rotation + Math.PI/2, 500, undefined, (v, done) => {
      this.rotation = v
      this._isAnimating = !done
    })
  }

  set zoom(zoom: number) {
    this._zoom= Math.max( MIN_ZOOM, Math.min(MAX_ZOOM, zoom))
    this.updateCameraFrame()
  }

  get zoom() : number {
    return this._zoom
  }
}

export { OrthographicCamera}