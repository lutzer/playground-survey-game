import React, { useState } from 'react'
import { SelectableTiles, TileType } from '../babylon/assets'
import { TileState } from '../babylon/tiles'

import closeIcon from './../assets/images/close.png'

import trampolinIcon from './../assets/images/icon_tile_trampolin.png'
import bouldersIcon from './../assets/images/icon_tile_boulders.png'
import houseIcon from './../assets/images/icon_tile_house.png'
import carousselIcon from './../assets/images/icon_tile_caroussel.png'
import sandboxIcon from './../assets/images/icon_tile_sandbox.png'
import seasawIcon from './../assets/images/icon_tile_seasaw.png'
import swingsIcon from './../assets/images/icon_tile_swings.png'
import slideIcon from './../assets/images/icon_tile_slide.png'
import treeIcon from './../assets/images/icon_tile_tree.png'
import emptyIcon from './../assets/images/icon_tile_empty.png'



import './TileMenu.scss'

// const TYPES : TileType[] = [
//   SelectableTiles.tree, 
//   SelectableTiles.swings,
//   SelectableTiles.trampolin,
//   SelectableTiles.slide,
//   SelectableTiles.sandbox,
//   SelectableTiles.house,
//   SelectableTiles.boulders,
//   SelectableTiles.seasaw,
//   SelectableTiles.carousel
// ]

const TileMenu = function({tileState, onSelect, numberOfSelectedTiles, maximumSelectedTies} : 
  {tileState?: TileState, onSelect : (t: TileType | undefined) => void, numberOfSelectedTiles: number, maximumSelectedTies: number}) : React.ReactElement {
  const [type, setType] = useState(tileState?.type)

  function onClickedHandler(t: TileType | undefined) {
    if (t) setType(t)
    onSelect(t)
  }

  const canSelectedNewTile = (numberOfSelectedTiles < maximumSelectedTies) || type != SelectableTiles.grass

  function renderTileLink(img: string, type: TileType, selected : boolean) {
    return(
      <li className={selected ? 'selected' : ''} onClick={() => onClickedHandler(type)} key={type}>
        <img src={img}/>  
      </li>
    )
  }

  return (
    <div className="TileMenu">
      <div className="overlay"></div>
      <div className="dialog">
        <div className="close-button" key="close" onClick={() => onClickedHandler(undefined)}>
          <img src={closeIcon}></img>
        </div>
        <p className="number-selected">Elemente ausgewählt: {numberOfSelectedTiles} von {maximumSelectedTies}</p>
        { canSelectedNewTile ?
          <ul>
            { renderTileLink(emptyIcon, SelectableTiles.grass, SelectableTiles.grass == type) }
            { renderTileLink(trampolinIcon, SelectableTiles.trampolin, SelectableTiles.trampolin == type) }
            { renderTileLink(bouldersIcon, SelectableTiles.boulders, SelectableTiles.boulders == type) }
            { renderTileLink(houseIcon, SelectableTiles.house, SelectableTiles.house == type) }
            { renderTileLink(carousselIcon, SelectableTiles.carousel, SelectableTiles.carousel == type) }
            { renderTileLink(sandboxIcon, SelectableTiles.sandbox, SelectableTiles.sandbox == type) }
            { renderTileLink(seasawIcon, SelectableTiles.seasaw, SelectableTiles.seasaw == type) }
            { renderTileLink(swingsIcon, SelectableTiles.swings, SelectableTiles.swings == type) }
            { renderTileLink(slideIcon, SelectableTiles.slide, SelectableTiles.slide == type) }
            { renderTileLink(treeIcon, SelectableTiles.tree, SelectableTiles.tree == type) }
          </ul>
          :
          <p>Du hast schon {maximumSelectedTies} Elemente ausgewaehlt. Du kannst bereits plazierte Elemente ändern oder sie löschen um neue zu plazieren.</p>
        }
      </div>
    </div>
  )
}

export { TileMenu }
