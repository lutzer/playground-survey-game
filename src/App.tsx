import React, { useEffect, useRef, useState } from 'react'
import { Engine } from '@babylonjs/core'
import { setupScene } from './babylon/scene'

import './App.scss'

// import '@babylonjs/inspector'

const App = function() : React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [engine, setEngine] = useState<Engine>()

  useEffect(() => {
    if (!canvasRef || canvasRef.current == null)
      return
    const engine = new Engine(canvasRef.current, true)
    const scene = setupScene(engine, canvasRef.current)
    setEngine(engine)
    return () => {
      scene?.dispose()
      engine?.dispose()
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
