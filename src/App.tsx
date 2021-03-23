import React, { useEffect, useRef, useState } from 'react'
import './App.scss'
import _ from 'lodash'
import { Engine, Scene } from '@babylonjs/core'
import { createScene } from './babylon/scene'

// import '@babylonjs/inspector'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [engine, setEngine] = useState<Engine>()

  useEffect(() => {
    if (!canvasRef || canvasRef.current == null)
      return
    const engine = new Engine(canvasRef.current, true)
    const scene = createScene(engine, canvasRef.current)
    setEngine(engine)
    return () => {
      scene?.dispose()
    }
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
