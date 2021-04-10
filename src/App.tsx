import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { PlaygroundSettings } from './babylon/playground'
import { Statemachine } from './state'

import './App.scss'
import { StartView } from './components/StartView'
import { PlaygroundView } from './components/PlaygroundView'

const SETTINGS : PlaygroundSettings = {
  gridSize: 7,
  width: 6.7,
  height: 6.7,
  camera: {
    isometric: false,
    zoom: 10
  },
  version: '0.12'
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
          <Route path="/playground">
            { stateMachine && <PlaygroundView stateMachine={stateMachine} settings={SETTINGS}/> }
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
