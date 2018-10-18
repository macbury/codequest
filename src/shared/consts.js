import Enum from 'enum'

export const Direction = new Enum([
  'Up',
  'Down',
  'Left',
  'Right',
  'None'
], { ignoreCase: true })

export const Trigger = new Enum([
  'Click',
  'Touch'
], { ignoreCase: true })

export const PlayerStatus = new Enum([
  'Setup',
  'Exploring',
  'Fighting',
  'Interacting',
  'Dead'
], { ignoreCase: true })

export const Align = new Enum([
  'Center',
  'Bottom',
  'None'
], { ignoreCase: true })

export const TILE_SIZE = 16
export const HALF_TILE_SIZE = TILE_SIZE / 2
export const TILE_COLS = 30
export const TILE_ROWS = 20
export const WORLD_WIDTH = 568
export const WORLD_HEIGHT = 320

export const PING_INTERVAL = 5000

export const MIN_ROWS = 20
export const MIN_COLS = 30
export const GAME_SCALE = 2

export const HEAD_COUNT = 43
export const MALE_HAIR_COUNT = 56
export const FEMALE_HAIR_COUNT = 43
export const START_ARMOR = 2
