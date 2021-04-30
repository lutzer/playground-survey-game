import React from 'react'
import { useHistory } from 'react-router'
import { Avatar } from '../state'

import explorerImage from '../assets/images/explorer.png'
import girlImage from '../assets/images/girl.png'
import kidsImage from '../assets/images/two_kids.png'

import './AvatarView.scss'

const AvatarView = function({ onSelect } : { onSelect: (avatar: Avatar) => void}) : React.ReactElement {
  const history = useHistory()

  function onAvatarSelect(avatar: Avatar) {
    onSelect(avatar)
    history.push('/waterbody')
  }

  return (
    <div className="avatar-view">
      <h1>Willkommen</h1>
      <p className="block">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet tristique mi. In hac habitasse platea dictumst. Praesent vitae tellus odio. Nunc in auctor tellus, et imperdiet risus. Duis varius neque orci, quis fermentum purus molestie sit amet. Mauris mollis, ante quis ullamcorper condimentum.</p>
      <h2>Wähle deinen Avatar</h2>
      <div className="avatar-list">
        <div className="avatar" onClick={() => onAvatarSelect('flower-girl')}>
          <div className="icon">
            <img src={explorerImage}></img>
          </div>
        </div>
        <div className="avatar" onClick={() => onAvatarSelect('explorer')}>
          <div className="icon">
            <img src={girlImage}></img>
          </div>
        </div>
        <div className="avatar" onClick={() => onAvatarSelect('social')}>
          <div className="icon">
            <img src={kidsImage}></img>
          </div>
        </div>
      </div>
    </div>
  )
}

export { AvatarView }
