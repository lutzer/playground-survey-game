import React, { useState } from 'react'
import { SelectableTiles } from '../babylon/assets'
import { TileState, TileType } from '../babylon/tile'

import closeIcon from './../assets/images/close.png'
import './TileMenu.scss'

// const TYPES : TileType[] = ['grass', 'tree', 'swings', 'trampolin', 'slide', 'sandbox', 'house', 'boulders']
const TYPES : TileType[] = [
  SelectableTiles.tree, 
  SelectableTiles.swings,
  SelectableTiles.trampolin,
  SelectableTiles.slide,
  SelectableTiles.sandbox,
  SelectableTiles.house,
  SelectableTiles.boulders
]

const TileMenu = function({tileState, onSelect, numberOfSelectedTiles, maximumSelectedTies} : 
  {tileState?: TileState, onSelect : (t: TileType | undefined) => void, numberOfSelectedTiles: number, maximumSelectedTies: number}) : React.ReactElement {
  const [type, setType] = useState(tileState?.type)

  function onClickedHandler(t: TileType | undefined) {
    if (t)
      setType(t)
    onSelect(t)
  }

  const canSelectedNewTile = (numberOfSelectedTiles < maximumSelectedTies) || type != SelectableTiles.grass

  return (
    <div className='TileMenu'>
      <div className="close-button" key="close" onClick={() => onClickedHandler(undefined)}>
        <img src={closeIcon}></img>
      </div>
      <p className="number-selected">Elemente ausgewählt: {numberOfSelectedTiles} von {maximumSelectedTies}</p>
      { canSelectedNewTile ?
        <ul>
          <li className={type == SelectableTiles.grass ? 'selected' : ''} onClick={() => onClickedHandler(SelectableTiles.grass)} key="grass">{SelectableTiles.grass}</li>
          { TYPES.map((t,i) => {
            return <li className={type == t ? 'selected' : ''} onClick={() => onClickedHandler(t)} key={t}>{t}</li>
          })}
        </ul>
        :
        <p>Du hast schon {maximumSelectedTies} Elemente ausgewaehlt. Du kannst bereits plazierte Elemente ändern oder sie löschen um neue zu plazieren.</p>
      }
    </div>
  )
}

export { TileMenu }
