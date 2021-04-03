import React, { useEffect, useRef, useState } from 'react'
import { Engine, Scene } from '@babylonjs/core'
import { Playground } from './babylon/scene'

import { TileMenu } from './components/TileMenu'

import './App.scss'
import { Tile } from './babylon/tile'

const App = function() : React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playground, setPlayground] = useState<Playground>()

  const [selectedTile, setSelectedTile] = useState<Tile>()

  // setup scene
  useEffect(() => {
    if (!canvasRef || canvasRef.current == null)
      return

    const playground = new Playground({ canvas: canvasRef.current })
    playground.init()
    playground.on('tile-selected', (t) => setSelectedTile(t) )
    setPlayground(playground)
    return () => {
      playground.dispose()
      setPlayground(undefined)
    }
  },[canvasRef])

  // handle tile unselect
  useEffect(() => {
    if (!selectedTile)
      playground?.unselectTile()
  },[selectedTile])

  //handle resize
  useEffect(() => {
    function onResize() {
      playground?.engine.resize()
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  },[playground])

  return (
    <div className='App'>
      <canvas ref={canvasRef} id='renderCanvas' touch-action='none'></canvas>
      { selectedTile && <TileMenu tile={selectedTile} onClose={() => setSelectedTile(undefined) } /> }
    </div>
  )
}

export default App
