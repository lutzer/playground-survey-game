import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import './FinishedView.scss'

import thankyouImg from './../assets/images/thankyou.png'
import replayIcon from './../assets/images/replay.png'

const FinishedView = function() : React.ReactElement {
  const history = useHistory()

  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className='finished-view'>
      <h1>Dankeschön!</h1>
      <div className="image"><img src={thankyouImg}/></div>
      <div className="block">
        Danke, dass du uns gezeigt hast was du gut findest und dir auf dem Spielplatz wünschst.<br/>
        Wenn viele Kinder uns sagen, was sie gerne wollen, können wir einen besseren Spielplatz für euch bauen. Also erzähle deinen Freunden und Nachbarn von dem Spiel!
        <div className="center" onClick={() => history.push('/')}><button>Neues Spiel<img className="right" src={replayIcon}/></button></div>
      </div>
      
      <div className="impressum">
        <button onClick={() => history.push('/impressum')}>Impressum</button>
      </div>
    </div>
  )
}

export { FinishedView }
