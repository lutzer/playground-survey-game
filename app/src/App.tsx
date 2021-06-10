import React, { useEffect, useState } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'

import { PlaygroundSettings } from './babylon/playground'
import { Actions, State, Statemachine } from './state'

import './App.scss'
import { AvatarView } from './components/AvatarView'
import { PlaygroundView } from './components/PlaygroundView'
import { WaterbodyView } from './components/WaterbodyView'
import { MissingTileView } from './components/MissingTileView'
import { FinishedView } from './components/FinishedView'
import { StartView } from './components/StartView'
import { ImpressumView } from './components/ImpressumView'

const API_ADDRESS = '/api/results/'
const SIZE = 8
const SETTINGS : PlaygroundSettings = {
  gridSize: SIZE,
  width: SIZE*0.9,
  height: SIZE*0.9,
  camera: {
    zoom: 5
  },
  version: '0.40',
  selectableTiles: 6
}

const App = function() : React.ReactElement {
  const [stateMachine, setStateMachine] = useState<Statemachine>()
  const [currentState, setCurrentState] = useState<State>()

  // setup statemachine and load state
  useEffect(() => {
    setStateMachine(new Statemachine(SETTINGS))
  },[])

  // update state
  useEffect(() => {
    setCurrentState(stateMachine?.state)
    const subscription = stateMachine?.subscribe((state) => {
      setCurrentState(state)
    })
    return () => {
      subscription?.unsubscribe()
    }
  }, [stateMachine])

  async function onSubmit() {
    fetch(API_ADDRESS, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stateMachine?.state)
    }).catch( (err) => {
      console.error(err)
    }).then(() => {
      stateMachine?.reset()
    })
  }


  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route path="/avatar">
            <AvatarView onSelect={(a) => stateMachine?.trigger(Actions.setAvatar, {avatar: a})} seed={currentState?.seed || 0}/>
          </Route>
          <Route path="/waterbody">
            <WaterbodyView onSelect={(t) => stateMachine?.trigger(Actions.setPlaygroundType, {type: t})} seed={currentState?.seed || 0}/>
          </Route>
          <Route path="/playground">
            { stateMachine && <PlaygroundView stateMachine={stateMachine} settings={SETTINGS}/> }
          </Route>
          <Route path="/missing-tile">
            <MissingTileView 
              initial={currentState?.missing || ''}
              onSubmit={(t) => { stateMachine?.trigger(Actions.setMissingText, { text: t}); onSubmit() }}/>
          </Route>
          <Route path="/finished">
            <FinishedView/>
          </Route>
          <Route path="/impressum">
            <ImpressumView/>
          </Route>
          <Route path="/">
            <StartView/>
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
