import React from 'react'

import './TileMenu.scss'
import { Tile, TileType } from '../babylon/tile'


const TileMenu = function({tile, onClose} : {tile?: Tile, onClose : () => void}) : React.ReactElement {

  function onClickedHandler(tileType: TileType) {
    if (tile)
      tile.type = tileType
  }

  return (
    <div className='TileMenu'>
      <ul>
        <li onClick={() => onClickedHandler('grass')}>Grass</li>
        <li onClick={() => onClickedHandler('tree')}>Tree</li>
        <li onClick={() => onClickedHandler('swings')} >Swing</li>
        <li onClick={() => onClose()} >Close</li>
      </ul>
    </div>
  )
}

export { TileMenu }
