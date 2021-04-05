import React, { useEffect, useRef, useState } from 'react'
import { Playground, PlaygroundSettings } from './babylon/playground'

import { TileMenu } from './components/TileMenu'
import { Actions, Statemachine } from './state'

import './App.scss'
import { TileType } from './babylon/tile'

const SETTINGS : PlaygroundSettings = {
  gridSize: 6,
  width: 6,
  height: 6,
  version: '0.8'
}

const App = function() : React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playground, setPlayground] = useState<Playground>()

  const [stateMachine, setStateMachine] = useState<Statemachine>()
  const [selectedTile, setSelectedTile] = useState<number>()

  // setup statemachine
  useEffect(() => {
    setStateMachine(new Statemachine(SETTINGS))
  },[])

  // setup scene
  useEffect(() => {
    if (!canvasRef || canvasRef.current == null || !stateMachine)
      return

    const playground = new Playground({ canvas: canvasRef.current, settings: SETTINGS, stateMachine: stateMachine })
    playground.init()
    setPlayground(playground)
    return () => {
      playground.dispose()
      setPlayground(undefined)
    }
  },[canvasRef, stateMachine])

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

  // subscribe to state changes
  useEffect(() => {
    setSelectedTile(stateMachine?.state.selectedTile)
    const sub = stateMachine?.subscribe( (state) => {
      setSelectedTile(state.selectedTile)
    })
    return () => sub?.unsubscribe()
  },[stateMachine])

  function onSelectTyleType(type: TileType | undefined) {
    if (type)
      stateMachine?.trigger(Actions.setTileType, { type: type })
    stateMachine?.trigger(Actions.selectTile, { id: undefined })
  }

  return (
    <div className='App'>
      <canvas ref={canvasRef} id='renderCanvas' touch-action='none'></canvas>
      { selectedTile != undefined && 
        <TileMenu
          onSelect={onSelectTyleType} 
        /> 
      }
    </div>
  )
}

export default App
