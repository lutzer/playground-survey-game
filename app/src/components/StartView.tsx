import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'

import './StartView.scss'

import playIcon from './../assets/images/play.png'

const StartView = function({onStart} : { onStart? : () => void}) : React.ReactElement {
  const history = useHistory()
  const [animate, startAnimation] = useState(false)

  function onButtonClicked() {
    if (onStart) onStart()
    history.push('/avatar')
  }

  // animate after certain time
  useEffect(() => {
    setTimeout(() => {
      startAnimation(true)
      window.scrollTo(0, 0)
    },3000)
  },[])

  return (
    <div className="start-view">
      <div className={ animate ? 'logo fade-out' : 'logo' }>
        <video width="500" height="250" autoPlay loop muted>
          <source src="/assets/videos/logo.mp4" type="video/mp4"/>
        </video>
      </div>
      <div className="content">
        <div className="block">
          <h1>Der Spielplatz im Schillerkiez</h1>
          Wir wollen in eurer Nähe einen neuen Spielplatz bauen. Und zwar nahe beim Tempelhofer Feld auf dem alten Friedhof neben dem Park, auf einer großen Wiese zwischen den Bäumen. Es soll viel Wasser zum Planschen geben und lustige Sachen zum Spielen.<br/>
          Kannst du uns dabei helfen?<br/>
          Was tust du gerne? Rennen und springen? Höhlen bauen? Mit anderen Kindern spielen?
          Such dir deine Figur aus und komm mit einen tollen Spielplatz zu planen.<br/>
          <span className="center">
            <button onClick={onButtonClicked}>Start<img className="right" src={playIcon}/></button>
          </span>
        </div>
        <div className="impressum">
          <button onClick={() => history.push('/impressum')}>Impressum</button>
        </div>
      </div>
    </div>
  )
}

export { StartView }
