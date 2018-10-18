import axios from 'axios'

export function buildNewEvent(tile) {
  return { type: 'BUILD_NEW_EVENT', payload: tile }
}

export function fetchAllMaps() {
  return function (dispatch) {
    axios.get('/api/maps').then(({ data, status }) => {
      if (status == 200) {
        dispatch({ type: 'FETCH_MAPS_SUCCESS', payload: data })
      } else {
        console.error(`Status code is ${status}`)
      }
    })
  }
}

export function fetchEvents(mapName) {
  return function (dispatch) {
    dispatch({ type: 'CLEAR_CURRENT_MAP' })
    axios.get(`/api/maps/${mapName}/events`).then(({ data, status }) => {
      if (status == 200) {
        let { entities } = data
        dispatch({ type: 'SET_CURRENT_MAP', payload: { name: mapName, events: entities.events || [] } })
      } else {
        console.error(`Status code is ${status}`)
      }
    })
  }
}

export function createEvent(mapName, event) {
  return function (dispatch) {
    axios.post(`/api/maps/${mapName}/events`, { event }).then(({ data, status }) => {
      if (status == 200) {
        dispatch({ type: 'UPDATE_EVENT', payload: event })
      } else {
        console.error(`Status code is ${status}`)
      }
    })
  }
}

export function updateEvent(mapName, event) {
  return function (dispatch) {
    axios.put(`/api/maps/${mapName}/events/${event.id}`, { event }).then(({ data, status }) => {
      dispatch({ type: 'UPDATE_EVENT', payload: event })
    })
  }
}

export function addNewPage() {
  return { type: 'ADD_NEW_PAGE' }
}

export function updateEventName(name) {
  return { type: 'UPDATE_EVENT_NAME', payload: name }
}

export function updateEventState(state) {
  return { type: 'UPDATE_EVENT_STATE', payload: state }
}

export function updateEventAction(action) {
  return { type: 'UPDATE_EVENT_ACTION', payload: action }
}

export function selectEventById(eventId) {
  return { type: 'SELECT_EVENT_BY_ID_ACTION', payload: eventId }
}
