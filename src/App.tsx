import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'

import { PlaygroundSettings } from './babylon/playground'
import { Statemachine } from './state'

import './App.scss'
import { AvatarView } from './components/AvatarView'
import { PlaygroundView } from './components/PlaygroundView'
import { WaterbodyView } from './components/WaterbodyView'
import { MissingTileView } from './components/MissingTileView'
import { FinishedView } from './components/FinishedView'

const SETTINGS : PlaygroundSettings = {
  gridSize: 7,
  width: 6.4,
  height: 6.4,
  camera: {
    isometric: false,
    zoom: 6
  },
  version: '0.23'
}

const App = function() : React.ReactElement {
  const [stateMachine, setStateMachine] = useState<Statemachine>()

  // setup statemachine and load state
  useEffect(() => {
    setStateMachine(new Statemachine(SETTINGS))
  },[])

  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route path="/avatar">
            <AvatarView/>
          </Route>
          <Route path="/waterbody">
            <WaterbodyView/>
          </Route>
          <Route path="/playground">
            { stateMachine && <PlaygroundView stateMachine={stateMachine} settings={SETTINGS}/> }
          </Route>
          <Route path="/missing-tile">
            <MissingTileView/>
          </Route>
          <Route path="/finished">
            <FinishedView/>
          </Route>
          <Route path="/">
            <Redirect to="/avatar"/>
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
