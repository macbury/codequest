import { findIndex } from 'underscore'

const initialState = {
  all: null,
  selected: null
}

export default function (state = initialState, { type, payload }) {
  switch(type) {
    case 'SAVE_ITEM_SUCCESS':
      var { item } = payload
      var found = false
      var items = state.all.map((existingItem) => {
        if (existingItem.id == item.id) {
          found = true
          return {...item}
        } else {
          return {...existingItem}
        }
      })
      if (!found) {
        items.push(item)
      }
      return {...state, all: items, selected: item}
    break
    case 'SET_CURRENT_ITEM_BY_ID':
      var item = state.all.find(({ id }) => id == payload)
      return {...state, selected: {...item}}
    break
    case 'CLEAR_CURRENT_ITEM':
      return {...state, selected: null}
    break
    case 'SET_CURRENT_ITEM':
      var selected = state.selected || {}
      return {...state, selected: {...selected, ...payload}}
    break
    case 'BUILD_ITEM':
      return {...state, selected: payload}
    break

    case 'FETCH_ITEMS_SUCCESS':
      return {...state, all: payload }
    break
  }
  return state
}
