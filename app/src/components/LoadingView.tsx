import React, { useState } from 'react'

import './LoadingView.scss'
import grassIcon from './../assets/images/icon_tile_grass.png'
import emptyIcon from './../assets/images/icon_tile_empty.png'

const hints : {text: string, img?: string }[] = [
  { text: 'Hey, ich habe hier ein paar Tips für dich, wie du deinen Spielpatz baust. Klicke einfach auf Weiter.' },
  { text: 'Du darfst 6 Sachen aussuchen, die du gerne auf einem Spielplatz haben willst und uns so zeigen, was dir wichtig ist.'},
  { text: 'Wenn du auf ein leeres Feld klickst, kannst du dort etwas bauen.', img: grassIcon},
  { text: 'Wenn du auf ein bebautes Feld klickst, kannst du es entfernen oder zu etwas Anderem ändern.', img: emptyIcon},
  { text: 'Du kannst die Ansicht drehen und näher heranzoomen. Wenn du zufrieden bist, drücke oben rechts auf Fertig.'}
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
          {hints[hintIndex].text}
          { hints[hintIndex].img && <span className="image"><img src={hints[hintIndex].img}/></span> }
          { !readAll() && <button onClick={onNextClicked}>Weiter</button> }
          <div className="floating-image"><img src={avatar}/></div>
        </div>
        { !loaded && 
          <div>
            <div className="spinner"></div> 
            <p className="center">Lade Spielplatz ...</p>
          </div>
        }
        { loaded && <div className="start-button"><button className="glow" onClick={() => onStartClicked()}>Start</button></div> }
        
      </div>
    </div>
  )
}

export { LoadingView }
