import React, { useState } from 'react'

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

const tileIcons: {type: SelectableTiles, icon: string, name: string}[] = [
  { type: SelectableTiles.trampolin, icon: trampolinIcon, name: 'Trampolin' },
  { type: SelectableTiles.boulders, icon: bouldersIcon, name: 'Felsen' },
  { type: SelectableTiles.house, icon: houseIcon, name: 'Baumhaus' },
  { type: SelectableTiles.carousel, icon: carousselIcon, name: 'Karoussel' },
  { type: SelectableTiles.sandbox, icon: sandboxIcon, name: 'Sandkasten' },
  { type: SelectableTiles.seasaw, icon: seasawIcon, name: 'Wippe' },
  { type: SelectableTiles.swings, icon: swingsIcon, name: 'Schaukel' },
  { type: SelectableTiles.slide, icon: slideIcon, name: 'Rutsche'  },
  { type: SelectableTiles.tree, icon: treeIcon, name: 'Wald' },
  { type: SelectableTiles.playhut, icon: playhutIcon, name: 'Spielhaus' },
  { type: SelectableTiles.junglegym, icon: gymIcon, name: 'Klettergerüst' },
  { type: SelectableTiles.springs, icon: springsIcon, name: 'Federwippe' }
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

  function renderTileLink(img: string, type: TileType, name: string, selected : boolean) {
    return(
      <li onClick={() => onClickedHandler(type)} key={type}>
        <img src={img}/>
        <span className="caption">{name}</span>
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
              { renderTileLink(emptyIcon, SelectableTiles.grass, '', SelectableTiles.grass == type) }
              { shuffledTiles.map((t) => renderTileLink(t.icon, t.type, t.name, t.type == type))}
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
