import React, { useState } from 'react'

import './LoadingView.scss'
import grassIcon from './../assets/images/icon_tile_grass.png'

const hints = [
  'Hey, ich habe hier ein paar Tips für dich, wie du deinen Spielpatz baust. Klicke einfach auf Weiter.',
  'Du darfst 6 Sachen aussuchen, die du gerne auf einem Spielplatz haben willst und uns so zeigen, was dir wichtig ist.',
  'Wenn du auf ein leeres Feld clickst, kannst du dort etwas bauen.',
  'Wenn du auf ein bebautes Feld klickst, kannst du es entfernen oder zu etwas anderem aendern.',
  'Du kannst die Ansicht drehen und näher heranzoomen. Wenn du zufrieden bist, drücke oben rechts auf Fertig.'
]

const LoadingView = function({ loaded, avatar, onStartClicked } : 
  { loaded : boolean, avatar?: string, onStartClicked: () => void }) : React.ReactElement {
  
  const [ hintIndex, setHintIndex] = useState(0)

  function onNextClicked() {
    setHintIndex(hintIndex + 1)
  }

  function readAll() {
    return hintIndex >= (hints.length-1)
  }

  return (
    <div className="loading-view">
      <div className="content">
        <h1>Was soll auf deinem Spielplatz sein?</h1>
        <div className="text-field">
          {hints[hintIndex]}
          { !readAll() && <button onClick={onNextClicked}>Weiter</button> }
          <div className="floating-image"><img src={avatar}/></div>
        </div>
        { !loaded && 
          <div>
            <div className="spinner"></div> 
            <p className="center">Lade Spielplatz ...</p>
          </div>
        }
        { loaded && readAll() && <div className="start-button"><button className="glow" onClick={() => onStartClicked()}>Start</button></div> }
        
      </div>
    </div>
  )
}

export { LoadingView }
