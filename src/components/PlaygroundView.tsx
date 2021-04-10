import React, { useEffect, useRef, useState } from 'react'
import { merge, of } from 'rxjs'
import { Playground, PlaygroundSettings } from '../babylon/playground'
import { TileType } from '../babylon/tile'
import { Actions, Statemachine } from '../state'
import { TileMenu } from './TileMenu'

import './PlaygroundView.scss'

const PlaygroundView = function({ stateMachine, settings } : { stateMachine: Statemachine, settings: PlaygroundSettings }) : React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playground, setPlayground] = useState<Playground>()

  const [selectedTile, setSelectedTile] = useState<number>()
  const [finished, setFinished] = useState(false)

  // setup scene
  useEffect(() => {
    if (!canvasRef || canvasRef.current == null)
      return

    const playground = new Playground({ canvas: canvasRef.current, settings: settings, stateMachine: stateMachine })
    playground.init()
    setPlayground(playground)
    return () => {
      playground.dispose()
      setPlayground(undefined)
    }
  },[canvasRef])

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
    const sub = merge(of(stateMachine.state),stateMachine).subscribe( (state) => {
      setSelectedTile(undefined)
      setSelectedTile(state.selectedTile)
    })
    return () => sub.unsubscribe()
  },[])

  // change stuff when playground is set to finished
  useEffect(() => {
    if (!finished || !playground)
      return
    stateMachine?.trigger(Actions.selectTile, { id: undefined })
    playground.enablePointerEvents = false
    playground.resetCamera()
  }, [finished])

  //tile type selection handler
  function onSelectTyleType(type: TileType | undefined) {
    if (type)
      stateMachine?.trigger(Actions.setTileType, { type: type })
    else
      stateMachine?.trigger(Actions.selectTile, { id: undefined })
  }

  function onScreenShotButtonClicked() {
    console.log('screenshot')
    playground?.takeScreenshot() 
  }
  

  return (
    <div className='PlaygroundView'>
      <canvas ref={canvasRef} id='renderCanvas' touch-action='none'></canvas>
      { selectedTile != undefined && 
        <TileMenu
          tileState={stateMachine?.state.tiles[selectedTile]}
          onSelect={onSelectTyleType} 
        /> 
      }
      { !finished ?
        <div className="finish-button">
          <button onClick={() => setFinished(true)}>Finished</button>
        </div>
        :
        <div className="screenshot-button">
          <button onClick={() => onScreenShotButtonClicked()}>Take Image</button>
        </div>
      }
    </div>
  )
}

export { PlaygroundView }
