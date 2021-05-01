import React, { useEffect, useRef, useState } from 'react'
import { merge, of } from 'rxjs'
import { Playground, PlaygroundSettings } from '../babylon/playground'
import { Actions, calculateNumberOfSelectedTiles, Statemachine } from '../state'
import { TileMenu } from './TileMenu'
import { useHistory } from 'react-router'
import { delay } from 'rxjs/internal/operators/delay'

import './PlaygroundView.scss'
import backIcon from '../assets/images/back.png'
import checkIcon from '../assets/images/check.png'
import { TileType } from '../babylon/assets'

enum LoadedState {
  LOADING,
  LOADED,
  STARTED
}

const PlaygroundView = function({ stateMachine, settings } : { stateMachine: Statemachine, settings: PlaygroundSettings }) : React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playground, setPlayground] = useState<Playground>()
  const [loaded, setLoaded] = useState(LoadedState.LOADING)
  const [finished, setFinished] = useState(false)

  const [selectedTile, setSelectedTile] = useState<number>()
  const [numberOfSelectedTiles, setNumberOfSelectedTiles] = useState(0)

  const history = useHistory()

  // setup scene
  useEffect(() => {
    if (!canvasRef || canvasRef.current == null)
      return

    const playground = new Playground({ canvas: canvasRef.current, settings: settings, stateMachine: stateMachine })
    playground.init(stateMachine.state.playgroundType, () => setLoaded(LoadedState.LOADED))
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
      { loaded != LoadedState.STARTED ?
        <div className="loading-screen">
          <h2>Was soll auf deinem Spielplatz sein?</h2>
          <p className="block">
          Du darfst 6 Sachen aussuchen, die du gerne auf einem Spielplatz haben willst und uns so zeigen, was dir wichtig ist.<br/>
          Du kannst lauter verschiedene Sachen aussuchen oder mehrere von einer Sorte nehmen.<br/>
          Du kannst sie auf die Fläche stellen und auch wieder wegnehmen und was Neues ausprobieren, bis du zufrieden bist.<br/>
          </p>
          { loaded != LoadedState.LOADED ? 
            <div>
              <div className="spinner"></div> 
              <p className="center">Lade Spielplatz ...</p>
            </div>
            : 
            <div className="start-button"><button className="glow" onClick={() => setLoaded(LoadedState.STARTED)}>Start</button></div>
          }
        </div>
        :
        <div>
          <div className="top-buttons">
            <button onClick={() => onScreenShotButtonClicked()}>Foto</button>
            { !finished && <button className="right" onClick={() => setFinished(true)}>Fertig</button> }
          </div>
          { selectedTile != undefined &&
            <TileMenu
              tileState={stateMachine?.state.tiles[selectedTile]}
              numberOfSelectedTiles={numberOfSelectedTiles}
              maximumSelectedTies={settings.selectableTiles}
              onSelect={onSelectTyleType} 
            /> 
          }
          { finished &&
            <div className="bottom-buttons">
              <button onClick={() => setFinished(false)}><img className="left" src={backIcon}/>Zurück</button>
              <button onClick={() => onFinished()} className="right glow">Weiter<img className="right" src={checkIcon}></img></button>
            </div>
          }
        </div>
      }
    </div>
  )
}

export { PlaygroundView }
