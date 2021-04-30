import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { Avatar } from '../state'

import explorerImage from '../assets/images/explorer.png'
import girlImage from '../assets/images/girl.png'
import kidsImage from '../assets/images/two_kids.png'

import './AvatarView.scss'

const AvatarView = function({ onSelect } : { onSelect: (avatar: Avatar) => void}) : React.ReactElement {
  const history = useHistory()
  const [selected, setSelected] = useState<string|undefined>(undefined)

  function onAvatarSelect(avatar: Avatar) {
    onSelect(avatar)
    setSelected(avatar)
    setTimeout(() => {
      history.push('/waterbody')
    },1000)
  }

  return (
    <div className="avatar-view">
      <h1>Willkommen</h1>
      <p className="block">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet tristique mi. In hac habitasse platea dictumst. Praesent vitae tellus odio. Nunc in auctor tellus, et imperdiet risus. Duis varius neque orci, quis fermentum purus molestie sit amet. Mauris mollis, ante quis ullamcorper condimentum.</p>
      <h2>Wähle deinen Avatar</h2>
      <div className="avatar-list">
        <div className={'avatar' + ((selected && selected != 'explorer') ? ' fade-out' : '')} onClick={() => onAvatarSelect('explorer')}>
          <div className="icon">
            <img src={explorerImage}></img>
          </div>
        </div>
        <div className={'avatar' + ((selected && selected != 'flower-girl') ? ' fade-out' : '')} onClick={() => onAvatarSelect('flower-girl')}>
          <div className="icon">
            <img src={girlImage}></img>
          </div>
        </div>
        <div className={'avatar' + ((selected && selected != 'social') ? '  fade-out' : '')} onClick={() => onAvatarSelect('social')}>
          <div className="icon">
            <img src={kidsImage}></img>
          </div>
        </div>
      </div>
    </div>
  )
}

export { AvatarView }
