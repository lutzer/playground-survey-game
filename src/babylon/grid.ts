import _ from 'lodash'
import { FixedTiles } from './assets'
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