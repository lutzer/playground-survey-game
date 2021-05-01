import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { PlayGroundType } from '../state'

import poolImg from './../assets/images/pool.png'
import streamImg from './../assets/images/stream.png'
import './WaterbodyView.scss'

const WaterbodyView = function({ onSelect } : { onSelect: (type: PlayGroundType) => void}) : React.ReactElement {
  const history = useHistory()
  const [selected, setSelected] = useState<string|undefined>(undefined)

  function onWaterbodySelect(type: PlayGroundType) {
    setSelected(type)
    onSelect(type)
    setTimeout(() => {
      history.push('/playground')
    },1000)
  }

  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="waterbody-view">
      <h1>Wie soll dein Spielplatz ausehen?</h1>
      <p className="block">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet tristique mi. In hac habitasse platea dictumst. Praesent vitae tellus odio. Nunc in auctor tellus, et imperdiet risus. Duis varius neque orci, quis fermentum purus molestie sit amet. Mauris mollis, ante quis ullamcorper condimentum, mi lacus vehicula risus, quis ultrices arcu lectus vitae dui. Sed id mauris eget purus pulvinar commodo laoreet vel elit. Quisque urna eros, tempor ac enim et, elementum bibendum tortor. Phasellus vel egestas ipsum. Quisque mi ante, maximus nec pretium quis, porttitor eget metus. Donec auctor iaculis maximus. In nec consequat nulla. Pellentesque a molestie sapien, et faucibus lorem.</p>
      <div className="waterbody-list">
        <div className={'waterbody' + ((selected && selected != 'pool') ? ' fade-out' : '')} onClick={() => onWaterbodySelect('pool')}>
          <div className="icon">
            <img src={poolImg}/>
          </div>
        </div>
        <div className={'waterbody' + ((selected && selected != 'river') ? ' fade-out' : '')} onClick={() => onWaterbodySelect('river')}>
          <div className="icon">
            <img src={streamImg}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export { WaterbodyView }
