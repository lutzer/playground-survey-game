import React from 'react'
import { Link } from 'react-router-dom'

import './FinishedView.scss'

const FinishedView = function() : React.ReactElement {

  return (
    <div className='finished-view'>
      <h1>Dankeschön!</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet tristique mi. In hac habitasse platea dictumst. Praesent vitae tellus odio. Nunc in auctor tellus, et imperdiet risus. Duis varius neque orci, quis fermentum purus molestie sit amet. Mauris mollis, ante quis ullamcorper condimentum, mi lacus vehicula risus, quis ultrices arcu lectus vitae dui. Sed id mauris eget purus pulvinar commodo laoreet vel elit. Quisque urna eros, tempor ac enim et, elementum bibendum tortor. Phasellus vel egestas ipsum. Quisque mi ante, maximus nec pretium quis, porttitor eget metus. Donec auctor iaculis maximus. In nec consequat nulla. Pellentesque a molestie sapien, et faucibus lorem.</p>
    </div>
  )
}

export { FinishedView }
