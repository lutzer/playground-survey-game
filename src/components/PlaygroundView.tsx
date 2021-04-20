import React, { useEffect, useRef, useState } from 'react'
import { merge, of } from 'rxjs'
import { Playground, PlaygroundSettings } from '../babylon/playground'
import { TileType } from '../babylon/tile'
import { Actions, Statemachine } from '../state'
import { TileMenu } from './TileMenu'

import './PlaygroundView.scss'
import { useHistory } from 'react-router'

const PlaygroundView = function({ stateMachine, settings } : { stateMachine: Statemachine, settings: PlaygroundSettings }) : React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playground, setPlayground] = useState<Playground>()
  const [loaded, setLoaded] = useState(false)

  const [selectedTile, setSelectedTile] = useState<number>()

  const history = useHistory()

  // setup scene
  useEffect(() => {
    if (!canvasRef || canvasRef.current == null)
      return

    const playground = new Playground({ canvas: canvasRef.current, settings: settings, stateMachine: stateMachine })
    playground.init(stateMachine.state.playgroundType, () => setLoaded(true))
    setPlayground(playground)
    return () => {
      playground.dispose()
      setPlayground(undefined)
    }
  },[canvasRef])

  //handle resize
  useEffect(() => {
    function onResize() {
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

  //tile type selection handler
  function onSelectTyleType(type: TileType | undefined) {
    if (type)
      stateMachine?.trigger(Actions.setTileType, { type: type })
    stateMachine?.trigger(Actions.selectTile, { id: undefined })
  }

  function onScreenShotButtonClicked() {
    playground?.takeScreenshot() 
  }

  function onFinishedClicked() {
    stateMachine?.trigger(Actions.selectTile, { id: undefined })
    if (playground)
      playground.enablePointerEvents = false
    history.push('/missing-tile')
  }
  

  return (
    <div className='playground-view'>
      <canvas ref={canvasRef} id='renderCanvas' touch-action='none'></canvas>
      { selectedTile != undefined && 
        <TileMenu
          tileState={stateMachine?.state.tiles[selectedTile]}
          onSelect={onSelectTyleType} 
        /> 
      }
      { loaded && 
        <div className="buttons">
          <button onClick={() => onScreenShotButtonClicked()}>Take Image</button>
          <button onClick={() => onFinishedClicked()}>Finished</button>
        </div>
      }
    </div>
  )
}

export { PlaygroundView }
