import axios from 'axios'

export function saveItem(item) {
  return function (dispatch) {
    axios.post('/api/items', { item }).then(({ data, status }) => {
      if (status == 200) {
        dispatch({ type: 'SAVE_ITEM_SUCCESS', payload: data })
      } else {
        console.error(`Status code is ${status}`)
      }
    })
  }
}

export function setCurrentItem(item) {
  return {
    type: 'SET_CURRENT_ITEM',
    payload: item
  }
}

export function setCurrentItemById(itemId) {
  return {
    type: 'SET_CURRENT_ITEM_BY_ID',
    payload: itemId
  }
}

export function clearCurrentItem() {
  return {
    type: 'CLEAR_CURRENT_ITEM'
  }
}

export function fetchAllItems() {
  return function (dispatch) {
    axios.get('/api/items.json').then(({ data, status }) => {
      if (status == 200) {
        dispatch({ type: 'FETCH_ITEMS_SUCCESS', payload: data })
      } else {
        console.error(`Status code is ${status}`)
      }
    })
  }
}

export function buildNewItem() {
  return {
    type: 'BUILD_ITEM',
    payload: {
      type: 'consumable',
      name: 'New item',
      description: 'Random item description',
      resource: 'dynamic/shared/armor/1'
    }
  }
}
