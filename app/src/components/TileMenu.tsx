import React, { useEffect, useState } from 'react'

import { shuffle } from 'shuffle-seed'
import { SelectableTiles, TileType } from '../babylon/assets'
import { TileState } from '../babylon/tiles'

import './TileMenu.scss'

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
import playhutIcon from './../assets/images/icon_tile_playhut.png'
import emptyIcon from './../assets/images/icon_tile_empty.png'
import gymIcon from './../assets/images/icon_tile_junglegym.png'
import springsIcon from './../assets/images/icon_tile_springs.png'

const tileIcons: {type: SelectableTiles, icon: string}[] = [
  { type: SelectableTiles.trampolin, icon: trampolinIcon },
  { type: SelectableTiles.boulders, icon: bouldersIcon },
  { type: SelectableTiles.house, icon: houseIcon },
  { type: SelectableTiles.carousel, icon: carousselIcon },
  { type: SelectableTiles.sandbox, icon: sandboxIcon },
  { type: SelectableTiles.seasaw, icon: seasawIcon },
  { type: SelectableTiles.swings, icon: swingsIcon },
  { type: SelectableTiles.slide, icon: slideIcon },
  { type: SelectableTiles.tree, icon: treeIcon },
  { type: SelectableTiles.playhut, icon: playhutIcon },
  { type: SelectableTiles.junglegym, icon: gymIcon },
  { type: SelectableTiles.springs, icon: springsIcon }
] 

const TileMenu = function({tileState, onSelect, numberOfSelectedTiles, maximumSelectedTies, seed} : 
  {tileState?: TileState, onSelect : (t: TileType | undefined) => void, numberOfSelectedTiles: number, maximumSelectedTies: number, seed : number}) : React.ReactElement {
  const [type, setType] = useState(tileState?.type)
  const [shuffledTiles] = useState( shuffle(tileIcons, seed))
  

  function onClickedHandler(t: TileType | undefined) {
    if (t) setType(t)
    onSelect(t)
  }

  const canSelectedNewTile = (numberOfSelectedTiles < maximumSelectedTies) || type != SelectableTiles.grass

  function renderTileLink(img: string, type: TileType, selected : boolean) {
    return(
      <li onClick={() => onClickedHandler(type)} key={type}>
        <img src={img}/>  
        { selected && <div className="selected"></div> }
      </li>
    )
  }

  return (
    <div className="TileMenu">
      <div className="overlay" onClick={() => onClickedHandler(undefined)}></div>
      <div className="dialog">
        <div className="dialog-header">
          <div className="close-button" key="close" onClick={() => onClickedHandler(undefined)}>
            <img src={closeIcon}></img>
          </div>
          <p className="number-selected">Elemente ausgewählt: {numberOfSelectedTiles} von {maximumSelectedTies}</p>
        </div>
        <div className="dialog-content">
          { canSelectedNewTile ?
            <ul>
              { renderTileLink(emptyIcon, SelectableTiles.grass, SelectableTiles.grass == type) }
              { shuffledTiles.map((t) => renderTileLink(t.icon, t.type, t.type == type))}
            </ul>
            :
            <p>Du hast schon {maximumSelectedTies} Elemente ausgewählt. Klicke ein bereits plaziertes Element an um es zu ändern oder zu löschen.
              <span className="image"><img src={emptyIcon}/></span>
            </p>
          }
        </div>
      </div>
    </div>
  )
}

export { TileMenu }
