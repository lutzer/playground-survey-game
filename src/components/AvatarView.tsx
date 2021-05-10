import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Avatar } from '../state'

import explorerImage from '../assets/images/explorer.png'
import builderImage from '../assets/images/builder.png'
import kidsImage from '../assets/images/two_kids.png'

import checkIcon from '../assets/images/check.png'
import backIcon from '../assets/images/arrow_back.png'

import './AvatarView.scss'
import { useLocation } from 'react-router-dom'

const descriptions = new Map<Avatar,{title: string, text: string, img: string}>()

descriptions.set('explorer', {
  title: 'Entdecker / in',
  text: 'Entdecker/in sind neugierig und möchten gerne herumlaufen und alles erkunden.',
  img: explorerImage
})

descriptions.set('builder', {
  title: 'Denker / in',
  text: 'Denker/in bauen gerne Dinge. Sie gehen den Sachen auf den Grund.',
  img: builderImage
})

descriptions.set('social', {
  title: 'Freunde',
  text: 'Freunde machen alles gemeinsam.',
  img: kidsImage
})

const AvatarView = function({ onSelect } : { onSelect: (avatar: Avatar) => void}) : React.ReactElement {
  const history = useHistory()

  const [selected, setSelected] = useState<Avatar|undefined>()

  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  function onAvatarSelect(avatar: Avatar) {
    setSelected(avatar)
    // history.push('/waterbody')
  }

  function onConfirm() {
    if (selected)
      onSelect(selected)
    history.push('/waterbody')
  }

  function onReject() {
    setSelected(undefined)
  }

  return (
    <div className="avatar-view">
      <h1>Wähle deinen Avatar</h1>
      <div className="avatar-list">
        <div className="avatar" onClick={() => onAvatarSelect('explorer')}>
          <div className="icon">
            <img src={explorerImage}></img>
          </div>
        </div>
        <div className="avatar" onClick={() => onAvatarSelect('builder')}>
          <div className="icon">
            <img src={builderImage}></img>
          </div>
        </div>
        <div className="avatar" onClick={() => onAvatarSelect('social')}>
          <div className="icon">
            <img src={kidsImage}></img>
          </div>
        </div>
      </div>
      { selected && 
        <div className="avatar-select-dialog">
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

export { AvatarView }
