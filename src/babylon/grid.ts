import _ from 'lodash'

type Grid = {
  cells: number[][],
  sizeX: number,
  sizeY: number
}

const createGrid = function(sizeX: number, sizeY = 0) : number[][] {
  sizeY = sizeY == 0 ? sizeX : sizeY
  const points = []
  for (const i of _.range(sizeX)) {
    for (const j of _.range(sizeY)) {
      points.push([i / (sizeX-1),j / (sizeY-1)])
    }
  }
  return points
}

export { createGrid }