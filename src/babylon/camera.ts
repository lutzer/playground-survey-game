import { Camera, Scene, UniversalCamera, Vector2, Vector3 } from '@babylonjs/core'
import { combineLatest, fromEvent, of, Subject, merge } from 'rxjs'
import { filter, skipWhile, switchMap, takeUntil } from 'rxjs/operators'
import Hammer from 'hammerjs'

import { animateValue, constrainRad, fromHammerEvent, snapTo } from './utils'

const MAX_ZOOM = 10
const MIN_ZOOM = 1

const MAX_X = 4
const MAX_Y = 4

const DISTANCE = 10

const ROTATION_THRESHOLD = 5
const PINCH_THRESHOLD = 0.1

const ROTATION_SNAP_POSITIONS = [ Math.PI * 1/4, Math.PI * 3/4, Math.PI * 5/4, Math.PI * 7/4]

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

  dispose() : void {
    this.$disposeObservable.next()
  }

  enableControl() : void {

    const mc = new Hammer(this.canvas)

    // react to pinching
    mc.get('pinch').set({ enable: true, threshold: PINCH_THRESHOLD })
    const $pinchStart = fromHammerEvent(mc, 'pinchstart')
    const $pinchEnd = fromHammerEvent(mc, 'pinchend')
    const $pinchMove = fromHammerEvent(mc, 'pinchmove')

    // react to rotating
    mc.get('rotate').set({ enable: true })
    const $rotateStart = fromHammerEvent(mc, 'rotatestart')
    const $rotateEnd = fromHammerEvent(mc, 'rotateend')
    const $rotateMove = fromHammerEvent(mc, 'rotatemove')

    const $pinchObservable = $pinchStart.pipe(switchMap( () =>
      combineLatest([$pinchMove, of(this._zoom)])
        .pipe(takeUntil($pinchEnd))
    ), takeUntil(this.$disposeObservable))

    $pinchObservable.subscribe(([move, zoom]) => {
      this.zoom = zoom / move.scale
    })

    const $rotateObservable = $rotateStart.pipe(switchMap( (start) =>
      combineLatest([$rotateMove, of(start), of(this.rotation)])
        .pipe(skipWhile( ([move, start]) => {
          return Math.abs(start.rotation - move.rotation) < ROTATION_THRESHOLD
        }),takeUntil($rotateEnd))
    ), takeUntil(this.$disposeObservable))

    $rotateObservable.subscribe(([move, start, rot]) => {
      const drot = start.rotation - move.rotation
      this.rotation = rot - drot / 180 * Math.PI
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
    this._rotation = constrainRad(angle)
    this.updateCameraPosition()
  }

  get rotation() : number {
    return this._rotation
  }

  rotateLeft() : void {
    if (this._isAnimating) return
    let angle = snapTo(constrainRad(this._rotation - Math.PI/2), ROTATION_SNAP_POSITIONS)
    angle = this._rotation - Math.PI/2 < 0 ? angle - Math.PI * 2 : angle
    animateValue(this._rotation, angle, 800, undefined, (v, done) => {
      this.rotation = v
      this._isAnimating = !done
    })
  }

  rotateRight() : void {
    if (this._isAnimating) return
    let angle = snapTo(constrainRad(this._rotation + Math.PI/2), ROTATION_SNAP_POSITIONS)
    angle = this._rotation + Math.PI/2 > Math.PI * 2 ? Math.PI * 2 + angle : angle
    animateValue(this._rotation, angle, 800, undefined, (v, done) => {
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