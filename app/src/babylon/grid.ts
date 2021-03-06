import _ from 'lodash'
import { FixedTiles, TileType } from './assets'

type GridCell = {
  position : [number, number]
  fixedTile : TileType | null
  rotation? : number
}

type Grid = {
  cells: GridCell[],
  size: [number, number]
}


function createTree(index : number, cells: GridCell[]) : void {
  cells[index] = { ...cells[index],
    fixedTile : Math.random() > 0.5 ? FixedTiles.trees1 : FixedTiles.trees2,
    rotation : _.sample([0, Math.PI / 2, Math.PI , Math.PI * 3/2])
  }
}

function createLighttower(index : number, cells: GridCell[]) : void {
  cells[index] = {...cells[index], 
    fixedTile : FixedTiles.lighttower, 
    rotation : Math.PI 
  }
}

function createAlley(index: number, cells: GridCell[]) : void {
  cells[index] = {...cells[index],
    fixedTile: _.sample([FixedTiles.alley1, FixedTiles.alley2]) || null,
    rotation: Math.random() > 0.5 ? 0 : Math.PI
  }
}

const createGrid = function(sizeX: number, sizeY = 0) : Grid {
  sizeY = sizeY == 0 ? sizeX : sizeY
  const cells : GridCell[] = []
  for (const i of _.range(sizeX)) {
    for (const j of _.range(sizeY)) {
      cells.push({ position: [i / (sizeX-1),j / (sizeY-1)], fixedTile : null})
    }
  }

  // create trees
  createTree(7+6*sizeY, cells)
  createTree(7+5*sizeY, cells)
  createTree(7+4*sizeY, cells)
  createTree(7+3*sizeY, cells)
  createTree(7+2*sizeY, cells)
  createTree(7+1*sizeY, cells)

  // add light towers
  createLighttower(7 + 7*sizeX, cells)
  createLighttower(7 + 0*sizeX, cells)

  // create alley
  for (const i of _.range(sizeX)) {
    createAlley(0+i*sizeX, cells)
  }
  
  return {
    cells: cells,
    size: [sizeX, sizeY ]
  }
}

const createRiverGrid = function(sizeX: number, sizeY = 0) : Grid {
  const grid = createGrid(sizeX, sizeY)
  const ox = Math.floor(sizeX/2) - 1
  const oy = Math.floor(sizeY || sizeX /2) - 1
  grid.cells[(ox - 2) * sizeX + oy + 1].fixedTile = FixedTiles.empty
  grid.cells[(ox - 2) * sizeX + oy + 0].fixedTile = FixedTiles.empty
  grid.cells[(ox - 1) * sizeX + oy + 1].fixedTile = FixedTiles.empty
  grid.cells[(ox - 1) * sizeX + oy + 0].fixedTile = FixedTiles.empty
  grid.cells[(ox + 0) * sizeX + oy + 0].fixedTile = FixedTiles.empty
  grid.cells[(ox + 0) * sizeX + oy + 1].fixedTile = FixedTiles.empty
  grid.cells[(ox + 1) * sizeX + oy + 1].fixedTile = FixedTiles.river
  grid.cells[(ox + 1) * sizeX + oy + 1].rotation = 0
  grid.cells[(ox + 1) * sizeX + oy + 0].fixedTile = FixedTiles.empty
  grid.cells[(ox + 2) * sizeX + oy + 0].fixedTile = FixedTiles.empty
  grid.cells[(ox + 3) * sizeX + oy + 0].fixedTile = FixedTiles.empty
  return grid
}

const createPlanscheGrid = function(sizeX: number, sizeY = 0) : Grid {
  const grid = createGrid(sizeX, sizeY)
  const ox = Math.floor(sizeX/2) - 2
  const oy = Math.floor(sizeY || sizeX /2) - 2
  grid.cells[(ox + 0) * sizeX + oy + 0].fixedTile = FixedTiles.empty
  grid.cells[(ox + 0) * sizeX + oy + 1].fixedTile = FixedTiles.empty
  grid.cells[(ox + 0) * sizeX + oy + 2].fixedTile = FixedTiles.empty
  grid.cells[(ox + 1) * sizeX + oy + 0].fixedTile = FixedTiles.empty
  grid.cells[(ox + 1) * sizeX + oy + 1].fixedTile = FixedTiles.pool
  grid.cells[(ox + 1) * sizeX + oy + 2].fixedTile = FixedTiles.empty
  grid.cells[(ox + 2) * sizeX + oy + 0].fixedTile = FixedTiles.empty
  grid.cells[(ox + 2) * sizeX + oy + 1].fixedTile = FixedTiles.empty
  grid.cells[(ox + 2) * sizeX + oy + 2].fixedTile = FixedTiles.empty
  return grid
}

export { createGrid, createRiverGrid, createPlanscheGrid }
export type { Grid }