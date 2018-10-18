export function getItems (req, res) {
  let game = req.app.get('game')
  res.json(game.items.data)
}

export function saveItem (req, res) {
  let game = req.app.get('game')
  let items = game.items
  let { item } = req.body

  if (item.id == null) {
    item.id = game.items.nextId()
  }

  let id = game.items.save(item)
  res.json({
    item,
    id
  })
}
