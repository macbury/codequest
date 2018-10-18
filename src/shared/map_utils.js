import { TILE_SIZE, HALF_TILE_SIZE, Direction } from './consts'

export function tileToWorldPosition(tile, outWorldPosition = {}) {
  let { col, row } = tile
  outWorldPosition.x = col * TILE_SIZE
  outWorldPosition.y = row * TILE_SIZE
  return outWorldPosition
}

/**
* @param {Direction} direction
*/
export function negateDirection(direction) {
  if (Direction.Up === direction) {
    return Direction.Down
  } else if (Direction.Down === direction) {
    return Direction.Up
  } else if (Direction.Left === direction) {
    return Direction.Right
  } else {
    return Direction.Left
  }
}

export function diffVec(a, b) {
  return {
    col: a.col - b.col,
    row: a.col - b.col
  }
}

export function vectorToDirection({ col, row }) {
  if (col > 0) {
    return Direction.Right
  } else if (col < 0) {
    return Direction.Left
  } else if (row > 0) {
    return Direction.Up
  } else {
    return Direction.Down
  }
}

/**
* @param {Direction} direction
*/
export function directionVector(direction) {
  if (Direction.Up == direction) {
    return { col: 0, row: -1 }
  } else if (Direction.Down == direction) {
    return { col: 0, row: 1 }
  } else if (Direction.Left == direction) {
    return { col: -1, row: 0 }
  } else {
    return { col: 1, row: 0 }
  }
}

export function tileToCharsetWorldPosition(tile, outWorldPosition = {}) {
  let { col, row } = tile
  outWorldPosition.x = col * TILE_SIZE + HALF_TILE_SIZE
  outWorldPosition.y = row * TILE_SIZE
  return outWorldPosition
}

export function pathTileToCharsetWorldPosition(tile) {
  return {
    x: tile.x * TILE_SIZE + HALF_TILE_SIZE,
    y: tile.y * TILE_SIZE
  }
}

export function worldToTile({ x, y }) {
  return {
    col: Math.floor(x / TILE_SIZE),
    row: Math.floor(y / TILE_SIZE)
  }
}

export function tileDistance(fromTile, toTile) {
  return Math.abs(fromTile.col - toTile.col) + Math.abs(fromTile.row - toTile.row)
}
