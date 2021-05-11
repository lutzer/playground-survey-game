import React from 'react'

import './LoadingView.scss'
import grassIcon from './../assets/images/icon_tile_grass.png'

const LoadingView = function({ loaded, onStartClicked } : { loaded : boolean, onStartClicked: () => void }) : React.ReactElement {

  return (
    <div className="loading-view">
      <div className="content">
        <h1>Was soll auf deinem Spielplatz sein?</h1>
        <p className="block">
          Du darfst 6 Sachen aussuchen, die du gerne auf einem Spielplatz haben willst und uns so zeigen, was dir wichtig ist.<br/>
          Wenn du auf ein leeres Feld clickst, kannst du dort etwas bauen:
          <span className="image"><img src={grassIcon}/></span>
          Wenn du auf ein bebautes Feld klickst, kannst du es entfernen oder zu etwas anderem aendern.
        </p>
        { loaded ? 
          <div>
            <div className="spinner"></div> 
            <p className="center">Lade Spielplatz ...</p>
          </div>
          : 
          <div className="start-button"><button className="glow" onClick={() => onStartClicked()}>Start</button></div>
        }
      </div>
    </div>
  )
}

export { LoadingView }
