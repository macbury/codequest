import { Direction } from './consts'

export function isTileEqual(tileA, tileB) {
  return tileA.col == tileB.col && tileA.row == tileB.row
}

export function getTileDirection(fromTile, toTile) {
  let xDiff = fromTile.col - toTile.col
  let yDiff = fromTile.row - toTile.row
  if (xDiff > 0) {
    return Direction.Left
  } else if (xDiff < 0) {
    return Direction.Right
  } else if (yDiff > 0) {
    return Direction.Up
  } else if (yDiff < 0) {
    return Direction.Down
  }

  return false
}
