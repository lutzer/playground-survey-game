import React, { useState } from 'react'
import { HintView } from './HintView'

import './LoadingView.scss'

const LoadingView = function({ loaded, avatar, onStartClicked } : 
  { loaded : boolean, avatar?: string, onStartClicked: () => void }) : React.ReactElement {

  return (
    <div className="loading-view">
      <div className="content">
        <h1>Was soll auf deinem Spielplatz sein?</h1>
        {/* <HintView avatar={avatar || ''}/> */}
        <div className="loading">
          { !loaded && 
            <div>
              <div className="spinner"></div> 
              <p className="center">Lade Spielplatz ...</p>
            </div>
          }
          { loaded && <div className="start-button"><button className="glow" onClick={() => onStartClicked()}>Start</button></div> }
        </div>
      </div>
    </div>
  )
}

export { LoadingView }
