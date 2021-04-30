import React, { useEffect, useRef, useState } from 'react'
import { merge, of } from 'rxjs'
import { Playground, PlaygroundSettings } from '../babylon/playground'
import { TileType } from '../babylon/tile'
import { Actions, calculateNumberOfSelectedTiles, Statemachine } from '../state'
import { TileMenu } from './TileMenu'
import { useHistory } from 'react-router'
import { delay } from 'rxjs/internal/operators/delay'

import './PlaygroundView.scss'
import backIcon from '../assets/images/back.png'
import checkIcon from '../assets/images/check.png'

const PlaygroundView = function({ stateMachine, settings } : { stateMachine: Statemachine, settings: PlaygroundSettings }) : React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playground, setPlayground] = useState<Playground>()
  const [loaded, setLoaded] = useState(false)
  const [finished, setFinished] = useState(false)

  const [selectedTile, setSelectedTile] = useState<number>()
  const [numberOfSelectedTiles, setNumberOfSelectedTiles] = useState(0)

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
    const sub = merge(of(stateMachine.state),stateMachine).pipe(delay(50)).subscribe( (state) => {
      setSelectedTile(undefined)
      setSelectedTile(state.selectedTile)
      setNumberOfSelectedTiles(calculateNumberOfSelectedTiles(state))
    })
    return () => sub.unsubscribe()
  },[])

  //handle finish click
  useEffect(() => {
    if (playground) {
      playground.enablePointerEvents = !finished
    }
    if (finished) {
      stateMachine?.trigger(Actions.selectTile, { id: undefined })
    }

  },[finished, playground])

  //tile type selection handler
  function onSelectTyleType(type: TileType | undefined) {
    if (type)
      stateMachine?.trigger(Actions.setTileType, { type: type })
    stateMachine?.trigger(Actions.selectTile, { id: undefined })
  }

  function onScreenShotButtonClicked() {
    playground?.takeScreenshot() 
  }

  function onFinished() {
    history.push('/missing-tile')
  }
  

  return (
    <div className='playground-view'>
      <canvas ref={canvasRef} id='renderCanvas' touch-action='none'></canvas>
      { selectedTile != undefined && 
        <TileMenu
          tileState={stateMachine?.state.tiles[selectedTile]}
          numberOfSelectedTiles={numberOfSelectedTiles}
          maximumSelectedTies={settings.selectableTiles}
          onSelect={onSelectTyleType} 
        /> 
      }
      { loaded && 
        <div className="top-buttons">
          <button onClick={() => onScreenShotButtonClicked()}>Foto</button>
          { !finished && <button className="right" onClick={() => setFinished(true)}>Fertig</button> }
        </div>
      }
      { finished && 
        <div className="bottom-buttons">
          <button onClick={() => setFinished(false)}><img className="left" src={backIcon}/>Zurück</button>
          <button onClick={() => onFinished()} className="right">Weiter<img className="right" src={checkIcon}></img></button>
        </div>
      }
    </div>
  )
}

export { PlaygroundView }
