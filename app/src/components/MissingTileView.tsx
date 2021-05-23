import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import './MissingTileView.scss'

import missingImage  from './../assets/images/missingtile.png'
import sendIcon from './../assets/images/send.png'

const MissingTileView = function({ onSubmit, initial } : { onSubmit: (text: string) => void, initial: string }) : React.ReactElement {
  const history = useHistory()
  const [text, setText] = useState(initial)


  function onFinishedClicked() {
    onSubmit(text)
    history.push('/finished')
  }

  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  

  return (
    <div className='missingtile-view'>
      <h1>Fehlt dir noch etwas?</h1>
      <div className="image"><img src={missingImage}/></div>
      <p className="block">
        Du hast deinen Spielplatz eingerichtet. Wünschst du dir noch ein Spielgerät oder Spielsache an die wir nicht gedacht haben? Dann schreibe uns deinen Wunsch auf.
      </p>
      <div className="text-field">
        <textarea
          placeholder="Schreibe hier was dir noch fehlt."
          value={text}
          onChange={(e) => setText(e.target.value)}>
        </textarea>
      </div>
      <div className="center">
        <button onClick={() => onFinishedClicked() }>Abschicken<img className="right" src={sendIcon}/></button>
      </div>
    </div>
  )
}

export { MissingTileView }
