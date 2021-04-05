import React, { useEffect, useRef, useState } from 'react'
import { Playground, PlaygroundSettings } from './babylon/playground'

import { TileMenu } from './components/TileMenu'
import { Actions, Statemachine } from './state'

import './App.scss'
import { TileType } from './babylon/tile'
import { merge, of } from 'rxjs'

const SETTINGS : PlaygroundSettings = {
  gridSize: 10,
  width: 10,
  height: 10,
  camera: {
    isometric: false,
    zoom: 10
  },
  version: '0.10'
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
    function onResize(e: any) {
      playground?.resize()
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  },[playground])

  // subscribe to state changes
  useEffect(() => {
    if (!stateMachine)
      return
    const sub = merge(of(stateMachine?.state),stateMachine).subscribe( (state) => {
      setSelectedTile(undefined)
      setSelectedTile(state.selectedTile)
    })
    return () => sub?.unsubscribe()
  },[stateMachine])

  function onSelectTyleType(type: TileType | undefined) {
    if (type)
      stateMachine?.trigger(Actions.setTileType, { type: type })
    else
      stateMachine?.trigger(Actions.selectTile, { id: undefined })
  }

  return (
    <div className='App'>
      <canvas ref={canvasRef} id='renderCanvas' touch-action='none'></canvas>
      { selectedTile != undefined && 
        <TileMenu
          tileState={stateMachine?.state.tiles[selectedTile]}
          onSelect={onSelectTyleType} 
        /> 
      }
    </div>
  )
}

export default App
