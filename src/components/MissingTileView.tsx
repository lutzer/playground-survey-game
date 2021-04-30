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
      <p className="block">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet tristique mi. In hac habitasse platea dictumst. Praesent vitae tellus odio. Nunc in auctor tellus, et imperdiet risus. Duis varius neque orci, quis fermentum purus molestie sit amet. Mauris mollis, ante quis ullamcorper condimentum, mi lacus vehicula risus, quis ultrices arcu lectus vitae dui. Sed id mauris eget purus pulvinar commodo laoreet vel elit. Quisque urna eros, tempor ac enim et, elementum bibendum tortor. Phasellus vel egestas ipsum. Quisque mi ante, maximus nec pretium quis, porttitor eget metus. Donec auctor iaculis maximus. In nec consequat nulla. Pellentesque a molestie sapien, et faucibus lorem.</p>
      <div className="text-field">
        <textarea
          placeholder="Schreibe hier was dir noch fehlt."
          value={text}
          onChange={(e) => setText(e.target.value)}>
        </textarea>
      </div>
      <button onClick={() => onFinishedClicked() }>Ich bin fertig</button>
    </div>
  )
}

export { MissingTileView }
