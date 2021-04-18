import _ from 'lodash'
import { TileType } from './tile'

type GridCell = {
  position : [number, number]
  fixedTile : TileType | null
}

type Grid = {
  cells: GridCell[],
  size: [number, number]
}

const createGrid = function(sizeX: number, sizeY = 0) : Grid {
  sizeY = sizeY == 0 ? sizeX : sizeY
  const cells : GridCell[] = []
  for (const i of _.range(sizeX)) {
    for (const j of _.range(sizeY)) {
      cells.push({ position: [i / (sizeX-1),j / (sizeY-1)], fixedTile : null})
    }
  }
  return {
    cells: cells,
    size: [sizeX, sizeY ]
  }
}

const createRiverGrid = function(sizeX: number, sizeY = 0) : Grid {
  sizeY = sizeY == 0 ? sizeX : sizeY
  const cells : GridCell[] = []
  for (const i of _.range(sizeX)) {
    for (const j of _.range(sizeY)) {
      cells.push({ position: [i / (sizeX-1),j / (sizeY-1)], fixedTile : null})
    }
  }
  return {
    cells: cells,
    size: [sizeX, sizeY ]
  }
}

const createPlanscheGrid = function(sizeX: number, sizeY = 0) : Grid {
  const grid = createGrid(sizeX, sizeY)
  const ox = Math.floor(sizeX/2) - 1
  const oy = Math.floor(sizeY || sizeX /2) - 1
  grid.cells[(ox + 0) * sizeX + oy + 0].fixedTile = 'pool1'
  grid.cells[(ox + 0) * sizeX + oy + 1].fixedTile = 'pool2'
  grid.cells[(ox + 0) * sizeX + oy + 2].fixedTile = 'pool3'
  grid.cells[(ox + 1) * sizeX + oy + 0].fixedTile = 'pool4'
  grid.cells[(ox + 1) * sizeX + oy + 1].fixedTile = 'pool5'
  grid.cells[(ox + 1) * sizeX + oy + 2].fixedTile = 'pool6'
  grid.cells[(ox + 2) * sizeX + oy + 0].fixedTile = 'pool7'
  grid.cells[(ox + 2) * sizeX + oy + 1].fixedTile = 'pool8'
  grid.cells[(ox + 2) * sizeX + oy + 2].fixedTile = 'pool9'
  return grid
}

export { createGrid, createRiverGrid, createPlanscheGrid }
export type { Grid }