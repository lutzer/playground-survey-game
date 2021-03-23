import React, { useEffect, useRef, useState } from 'react'
import * as BABYLON from '@babylonjs/core'
import './App.scss'
import _ from 'lodash'
import { Tile } from './babylon/tile'
import { Vec3 } from './babylon/types'
import { Vector3 } from '@babylonjs/core'
import { createGrid } from './babylon/grid'
// import '@babylonjs/inspector'

const settings = {
  gridSize: 10,
  width: 10,
  height: 10
}

function App() {
  const canvasRef = useRef(null)
  const [engine, setEngine] = useState<BABYLON.Engine>()

  function createScene(canvas: HTMLCanvasElement | null) {
    const engine = new BABYLON.Engine(canvas, true)
    const scene = new BABYLON.Scene(engine)

    const camera = new BABYLON.ArcRotateCamera('camera', -Math.PI * 1.25, Math.PI / 5, 25, new BABYLON.Vector3(0, 0, 0), scene)
    camera.attachControl(canvas, true)
    // camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    // camera.orthoLeft = -10;
    // camera.orthoRight = 10;
    // camera.orthoBottom = -10;
    // camera.orthoTop = 10;
  
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0),scene)
    light.intensity = 0.4
    const dirLight = new BABYLON.DirectionalLight('dir', new BABYLON.Vector3(0, -1, 0), scene)
    dirLight.position.y = 10
    // const shadowGenerator = new BABYLON.ShadowGenerator(1024, dirLight)

    const grid = createGrid(settings.gridSize)

    const tiles = grid.map(([x,y], i) => {
      const tile = new Tile(`box${i}`, scene)
      tile.pos = new Vector3(
        x * settings.width - settings.width/2, 
        0.7 + Math.random() * 0.2,
        y * settings.height - settings.height/2)
      tile.show()
      return tile
    })

    const ground = BABYLON.MeshBuilder.CreateGround('ground', {width: settings.width, height: settings.height})
    // ground.receiveShadows = true
    scene.addMesh(ground)

    engine.runRenderLoop(function () {
      scene.render()
    })

    setEngine(engine)

    // scene.debugLayer.show()
  }

  useEffect(() => {
    if (canvasRef)
      createScene(canvasRef.current)
  },[canvasRef])

  //handle resize
  useEffect(() => {
    function onResize() {
      engine?.resize()
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  },[engine])

  return (
    <div className='App'>
      <canvas ref={canvasRef} id='renderCanvas' touch-action='none'></canvas>
    </div>
  )
}

export default App
