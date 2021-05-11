import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import './FinishedView.scss'

import thankyouImg from './../assets/images/thankyou.png'

const FinishedView = function() : React.ReactElement {

  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className='finished-view'>
      <h1>Dankeschön!</h1>
      <div className="image"><img src={thankyouImg}/></div>
      <p className="block">
        Danke, dass du uns gezeigt hast was du gut findest und dir auf dem Spielplatz wünschst.<br/>
        Wenn viele Kinder uns sagen, was sie gerne wollen, können wir einen besseren Spielplatz für euch bauen. Also erzähle deinen Freunden und Nachbarn von dem Spiel!
      </p>
    </div>
  )
}

export { FinishedView }
