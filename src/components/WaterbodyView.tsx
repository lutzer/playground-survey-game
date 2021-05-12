import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { PlayGroundType } from '../state'

import './WaterbodyView.scss'

import poolImg from './../assets/images/pool.png'
import streamImg from './../assets/images/stream.png'
import checkIcon from '../assets/images/check.png'
import backIcon from '../assets/images/arrow_back.png'
import { shuffle } from 'shuffle-seed'

const descriptions = new Map<PlayGroundType,{title: string, text: string, img: string}>()

descriptions.set('pool', {
  title: 'Plansche',
  text: 'Ein großes Wasserbecken in dem du herumlaufen und planschen und spritzen kannst.',
  img: poolImg
})

descriptions.set('river', {
  title: 'Bach',
  text: 'Einen Bach mit Strömung und Wasserfällen in dem du Staudämme bauen kannst und Boote schwimmen lässt und mit dem Wasser spielst.',
  img: streamImg
})

const WaterbodyView = function({ onSelect, seed } : { onSelect: (type: PlayGroundType) => void, seed: number }) : React.ReactElement {
  const history = useHistory()
  const [selected, setSelected] = useState<PlayGroundType|undefined>()

  const waterbodies = shuffle<PlayGroundType>(['pool', 'river'], seed)

  function onWaterbodySelect(type: PlayGroundType) {
    setSelected(type)
  }

  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  function onConfirm() {
    if (selected)
      onSelect(selected)
    history.push('/playground')
  }

  function onReject() {
    setSelected(undefined)
  }

  function renderWaterbody(type: PlayGroundType) : JSX.Element {
    return(
      <div key={type} className="waterbody" onClick={() => onWaterbodySelect(type)}>
        <div className="icon">
          <img src={type == 'pool' ? poolImg : streamImg }/>
        </div>
      </div>
    )
  }

  return (
    <div className="waterbody-view">
      <h1>Wie soll dein Spielplatz ausehen?</h1>
      <p className="block">
      Es soll ein Spielplatz mit viel Wasser sein ...
      </p>
      <div className="waterbody-list">
        { waterbodies.map((w) => renderWaterbody(w)) }
      </div>
      { selected && 
        <div className="water-select-dialog">
          <div className="overlay"></div>
          <div className="dialog">
            <h2>{descriptions.get(selected)?.title}</h2>
            <img src={descriptions.get(selected)?.img}></img>
            <p>{descriptions.get(selected)?.text}</p>
            <div className="button-group">
              <button className="round" onClick={onReject}><img src={backIcon}></img></button>
              <button className="round" onClick={onConfirm}><img src={checkIcon}></img></button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export { WaterbodyView }
