import { Direction, Trigger, TILE_SIZE } from '../../shared/consts'
import uuidv4 from 'uuid/v4'
import _ from 'underscore'
import zpad from 'zpad'

const initialState = {
  all: null,
  selected: null,
  event: null,
  currentPage: null
}

const baseAction = {
  links: [],
  offsetX: 0,
  offsetY: 0,
  zoom: 100,
  id: 'abc',
  gridSize: 0,
  nodes: [
    {
      id: "d44e1e1c-de17-4ae6-89c0-12ed6aeeb18e",
      type: 'trigger',
      x: 50,
      y: 50,
      extras: {},
      ports: [
        {
          id: "f7ac95d9-c092-4047-a900-b09c4e04cefd",
          type: 'output',
          name: 'output',
          parentNode: "d44e1e1c-de17-4ae6-89c0-12ed6aeeb18e",
          links: []
        }
      ]
    }
  ]
}

function buildEvent({ selected }, { col, row }) {
  let { events } = selected
  let { id } = _.max(Object.values(events), ({ id }) => id)
  let nextId = (id || 0) + 1
  return {
    name: 'Event' + zpad(nextId, 3),
    id: nextId,
    width: TILE_SIZE,
    height: TILE_SIZE,
    x: col * TILE_SIZE,
    y: row * TILE_SIZE,
    visible: true,
    pages: [
      { conditions: [], action: {...baseAction, id: uuidv4()}, state: { direction: Direction.Down.value, trigger: Trigger.Click.value  } }
    ]
  }
}

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case 'SELECT_EVENT_BY_ID_ACTION':
      let { events } = state.selected
      let event = events[`ev:${payload}`]
      return {...state, event: event, currentPage: 0}
    case 'UPDATE_EVENT_ACTION':
      var event = {...state.event}
      var currentPage = event.pages[state.currentPage]
      currentPage.action = {...payload}
      return {...state, event: event}
    case 'UPDATE_EVENT_STATE':
      var event = {...state.event}
      var currentPage = event.pages[state.currentPage]
      currentPage.state = {...currentPage.state, ...payload}
      return {...state, event: event}
    case 'UPDATE_EVENT_NAME':
      return {...state, event: {...state.event, name: payload}}
    case 'BUILD_NEW_EVENT':
      return {...state, event: buildEvent(state, payload), currentPage: 0}
    case 'CLEAR_CURRENT_MAP':
      return {...state, selected: null}
    case 'FETCH_MAPS_SUCCESS':
      let { maps } = payload
      return {...state, all: maps}
    case 'SET_CURRENT_MAP':
      return {...state, selected: payload}
  }
  return {...state}
}
