import React, { useEffect, useRef, useState } from 'react'
import { merge, of } from 'rxjs'
import { Playground, PlaygroundSettings } from '../babylon/playground'
import { Actions, Avatar, calculateNumberOfSelectedTiles, Statemachine } from '../state'
import { TileMenu } from './TileMenu'
import { useHistory } from 'react-router'
import { delay } from 'rxjs/internal/operators/delay'
import { TileType } from '../babylon/assets'
import { LoadingView } from './LoadingView'

import './PlaygroundView.scss'

import checkIcon from '../assets/images/check.png'
import helpIcon from '../assets/images/help.png'
import rotateRightIcon from '../assets/images/rotate_right.png'
import rotateLeftIcon from '../assets/images/rotate_left.png'

import explorerImage from '../assets/images/explorer.png'
import builderImage from '../assets/images/builder.png'
import kidsImage from '../assets/images/two_kids.png'
import { HintView } from './HintView'


enum LoadedState {
  LOADING,
  LOADED,
  STARTED
}

function getAvatarImage(avatar? : Avatar) : string|undefined {
  switch (avatar) {
  case 'explorer':
    return explorerImage
  case 'builder':
    return builderImage
  case 'social':
    return kidsImage
  }
  return undefined
}

const PlaygroundView = function({ stateMachine, settings } : { stateMachine: Statemachine, settings: PlaygroundSettings }) : React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playground, setPlayground] = useState<Playground>()
  const [loaded, setLoaded] = useState(LoadedState.LOADING)
  const [finished, setFinished] = useState(false)
  const [showHelp, setShowHelp] = useState(true)

  const [seed] = useState(stateMachine.state.seed)

  const [selectedTile, setSelectedTile] = useState<number>()
  const [numberOfSelectedTiles, setNumberOfSelectedTiles] = useState(0)

  const [avatar] = useState(getAvatarImage(stateMachine.state.avatar))

  const history = useHistory()

  // setup scene
  useEffect(() => {
    if (!canvasRef || canvasRef.current == null)
      return
    // disable context menu
    canvasRef.current.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation() }

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
    const sub = merge(of(stateMachine.state),stateMachine).pipe(delay(150)).subscribe( (state) => {
      setSelectedTile(undefined)
      if (state.selectedTile) {
        setShowHelp(false)
        setSelectedTile(state.selectedTile)
      }
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

  useEffect(() => {
    if (playground && loaded == LoadedState.STARTED)
      playground.enable = true
  }, [loaded])

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

  function raiseZoom() {
    if (playground)
      playground.camera.zoom -= 1
  }

  function lowerZoom() {
    if (playground)
      playground.camera.zoom += 1
  }

  function rotateLeft() {
    playground?.camera.rotateLeft()
  }

  function rotateRight() {
    playground?.camera.rotateRight()
  }

  return (
    <div className='playground-view'>
      <canvas ref={canvasRef} id='renderCanvas' touch-action='none' onSelectCapture={(e) => e.preventDefault()}></canvas>
      { loaded != LoadedState.STARTED ?
        <LoadingView 
          avatar={avatar}
          loaded={loaded != LoadedState.LOADING} 
          onStartClicked={() => setLoaded(LoadedState.STARTED)} />
        :
        <div>
          { !finished && 
            <div className="top-buttons">
              <button className="help-button" onClick={() => setShowHelp(true)}>?</button>
              <div className="top-right">
                <button onClick={() => setFinished(true)}>Fertig</button>
                <TileCounter count={numberOfSelectedTiles} maximum={settings.selectableTiles}/>
              </div> 
            </div>
          }
          <div className="bottom-buttons">
            { !finished ? 
              <div className="center-menu">
                <button className="button-zoom" onClick={rotateLeft}><img src={rotateLeftIcon}/></button>
                <div className="avatar-icon">
                  <img src={avatar}/>
                </div>
                <button className="button-zoom" onClick={rotateRight}><img src={rotateRightIcon}/></button>
              </div>
              : 
              <div className="space-between">
                <button onClick={() => setFinished(false)}>Ich bin noch nicht fertig</button>
                {/* <button onClick={() => onScreenShotButtonClicked()}>Foto</button> */}
                <button onClick={() => onFinished()} className="right glow">Weiter<img className="right" src={checkIcon}></img></button>
              </div>
            }
          </div>
          { selectedTile != undefined &&
            <TileMenu
              tileState={stateMachine?.state.tiles[selectedTile]}
              numberOfSelectedTiles={numberOfSelectedTiles}
              maximumSelectedTies={settings.selectableTiles}
              onSelect={onSelectTyleType} 
              seed={seed}
            /> 
          }
          
        </div>
      }
      { showHelp && 
        <HintView 
          avatar={avatar || ''} 
          onClose={loaded == LoadedState.STARTED ? (() => setShowHelp(false)) : undefined} 
          startHint={loaded == LoadedState.STARTED ? 1 : 0}/> 
      }
    </div>
  )
}

import tileIcon from './../assets/images/icon_tile_grass.png'

const TileCounter = function({ count, maximum} : { count: number, maximum: number}) : React.ReactElement {
  return(
    <div className="tile-counter">
      <img src={tileIcon}/>
      <span>{count}/{maximum}</span>
    </div>
  )
}

export { PlaygroundView }
