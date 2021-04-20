import React from 'react'
import {  useHistory } from 'react-router-dom'

import './MissingTileView.scss'

const MissingTileView = function() : React.ReactElement {
  const history = useHistory()

  return (
    <div className='missingtile-view'>
      <h1>Fehlt dir noch etwas?</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet tristique mi. In hac habitasse platea dictumst. Praesent vitae tellus odio. Nunc in auctor tellus, et imperdiet risus. Duis varius neque orci, quis fermentum purus molestie sit amet. Mauris mollis, ante quis ullamcorper condimentum, mi lacus vehicula risus, quis ultrices arcu lectus vitae dui. Sed id mauris eget purus pulvinar commodo laoreet vel elit. Quisque urna eros, tempor ac enim et, elementum bibendum tortor. Phasellus vel egestas ipsum. Quisque mi ante, maximus nec pretium quis, porttitor eget metus. Donec auctor iaculis maximus. In nec consequat nulla. Pellentesque a molestie sapien, et faucibus lorem.</p>
      <div className="text-field">
        <textarea>
            
        </textarea>
      </div>
      <button onClick={() => history.push('/finished')}>Ich bin fertig</button>
    </div>
  )
}

export { MissingTileView }
