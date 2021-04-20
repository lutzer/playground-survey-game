import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { PlayGroundType } from '../state'

import './WaterbodyView.scss'

const WaterbodyView = function() : React.ReactElement {
  const history = useHistory()

  function onWaterbodySelect(type: PlayGroundType) {
    history.push('playground')
  }

  return (
    <div className="waterbody-view">
      <h1>Wie soll dein Spielplatz ausehen?</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet tristique mi. In hac habitasse platea dictumst. Praesent vitae tellus odio. Nunc in auctor tellus, et imperdiet risus. Duis varius neque orci, quis fermentum purus molestie sit amet. Mauris mollis, ante quis ullamcorper condimentum, mi lacus vehicula risus, quis ultrices arcu lectus vitae dui. Sed id mauris eget purus pulvinar commodo laoreet vel elit. Quisque urna eros, tempor ac enim et, elementum bibendum tortor. Phasellus vel egestas ipsum. Quisque mi ante, maximus nec pretium quis, porttitor eget metus. Donec auctor iaculis maximus. In nec consequat nulla. Pellentesque a molestie sapien, et faucibus lorem.</p>
      <div className="waterbody-list">
        <div className="waterbody" onClick={() => onWaterbodySelect('pool')}>
          <div className="icon"></div>
          <p className="caption">Plansche</p>
        </div>
        <div className="waterbody" onClick={() => onWaterbodySelect('river')}>
          <div className="icon"></div>
          <p className="caption">Fluss</p>
        </div>
      </div>
    </div>
  )
}

export { WaterbodyView }
