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
      <p className="block">
      Es soll ein Spielplatz mit viel Wasser sein. Was findest du schöner:<br/>
      Ein großes Wasserbecken in dem du herumlaufen und planschen und spritzen kannst?<br/>
      Einen Bach mit Strömung und Wasserfällen in dem du Staudämme bauen kannst und Boote schwimmen lässt und mit dem Wasser spielst?
      </p>
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
