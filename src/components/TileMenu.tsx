import React, { useState } from 'react'
import { TileState, TileType } from '../babylon/tile'

import './TileMenu.scss'

const TYPES : TileType[] = ['grass', 'tree', 'swings', 'trampolin', 'slide']

const TileMenu = function({tileState, onSelect} : {tileState?: TileState, onSelect : (t: TileType | undefined) => void}) : React.ReactElement {
  const [type, setType] = useState(tileState?.type)

  function onClickedHandler(t: TileType | undefined) {
    setType(t)
    onSelect(t)
  }

  return (
    <div className='TileMenu'>
      <ul>
        { TYPES.map((t,i) => {
          return <li className={type == t ? 'selected' : ''} onClick={() => onClickedHandler(t)} key={i}>{t}</li>
        })}
        <li className="close" onClick={() => onClickedHandler(undefined)}>Close</li>
      </ul>
    </div>
  )
}

export { TileMenu }
