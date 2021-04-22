import React from 'react'
import { useHistory } from 'react-router'
import { Avatar } from '../state'

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
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet tristique mi. In hac habitasse platea dictumst. Praesent vitae tellus odio. Nunc in auctor tellus, et imperdiet risus. Duis varius neque orci, quis fermentum purus molestie sit amet. Mauris mollis, ante quis ullamcorper condimentum, mi lacus vehicula risus, quis ultrices arcu lectus vitae dui. Sed id mauris eget purus pulvinar commodo laoreet vel elit.</p>
      <h2>Wähle deinen Avatar</h2>
      <div className="avatar-list">
        <div className="avatar" onClick={() => onAvatarSelect('flower-girl')}>
          <div className="icon"></div>
          <p className="caption">Avatar1</p>
        </div>
        <div className="avatar" onClick={() => onAvatarSelect('explorer')}>
          <div className="icon"></div>
          <p className="caption">Avatar2</p>
        </div>
        <div className="avatar" onClick={() => onAvatarSelect('social')}>
          <div className="icon"></div>
          <p className="caption">Avatar3</p>
        </div>
      </div>
    </div>
  )
}

export { AvatarView }
