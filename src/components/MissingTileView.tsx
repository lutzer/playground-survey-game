import React, { useState } from 'react'
import {  useHistory } from 'react-router-dom'

import './MissingTileView.scss'

const MissingTileView = function({ onSubmit, initial } : { onSubmit: (text: string) => void, initial: string }) : React.ReactElement {
  const history = useHistory()
  const [text, setText] = useState(initial)


  function onFinishedClicked() {
    onSubmit(text)
    history.push('/finished')
  }

  return (
    <div className='missingtile-view'>
      <h1>Fehlt dir noch etwas?</h1>
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
        <button onClick={() => onFinishedClicked() }>Alles Abschicken</button>
      </div>
    </div>
  )
}

export { MissingTileView }
