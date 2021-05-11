import React from 'react'
import { useHistory } from 'react-router'

import './StartView.scss'

import towerImg from '../assets/images/lighttower.png'

const StartView = function({onStart} : { onStart : () => void}) : React.ReactElement {
  const history = useHistory()

  function onButtonClicked() {
    onStart()
    history.push('/avatar')
  }

  return (
    <div className="start-view">
      <h1>Willkommen auf dem Spielplatz xxx</h1>
      <div className="image"><img src={towerImg}/></div>
      <p className="block">
        Wir wollen in eurer Nähe einen neuen Spielplatz bauen. Und zwar nahe beim Tempelhofer Feld auf dem alten Friedhof neben dem Park, auf einer großen Wiese zwischen den Bäumen. Es soll viel Wasser zum Planschen geben und lustige Sachen zum Spielen.<br/>
        Kannst du uns dabei helfen?<br/>
        Was tust du gerne? Rennen und springen? Höhlen bauen? Mit anderen Kindern spielen?
        Such dir deine Figur aus und komm mit einen tollen Spielplatz zu planen.<br/>
        <div className="center">
          <button onClick={onButtonClicked}>Weiter</button>
        </div>
      </p>
    </div>
  )
}

export { StartView }
