import React from 'react'
import { TileState, TileType } from '../babylon/tile'

import './TileMenu.scss'


const TileMenu = function({tileState, onSelect} : {tileState?: TileState, onSelect : (t: TileType | undefined) => void}) : React.ReactElement {


  return (
    <div className='TileMenu'>
      <ul>
        <li onClick={() => onSelect('grass')}>Grass</li>
        <li onClick={() => onSelect('tree')}>Tree</li>
        <li onClick={() => onSelect('swings')} >Swing</li>
        <li onClick={() => onSelect('trampolin')} >Trampolin</li>
        <li onClick={() => onSelect('slide')} >Slide</li>
        <li onClick={() => onSelect(undefined)} >Close</li>
      </ul>
    </div>
  )
}

export { TileMenu }
