import _ from 'lodash'

type Grid = {
  cells: number[][],
  size: [number, number]
}

const createGrid = function(sizeX: number, sizeY = 0) : Grid {
  sizeY = sizeY == 0 ? sizeX : sizeY
  const points = []
  for (const i of _.range(sizeX)) {
    for (const j of _.range(sizeY)) {
      points.push([i / (sizeX-1),j / (sizeY-1)])
    }
  }
  return {
    cells: points,
    size: [sizeX, sizeY ]
  }
}

export { createGrid }
export type { Grid }