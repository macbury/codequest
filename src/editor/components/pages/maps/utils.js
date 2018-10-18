import _ from 'underscore'

export function arrangeIntoTree(paths, selected) {
  var tree = []

  _.each(paths, function(path) {

    var pathParts = path.split('/')
    var currentLevel = tree

    while(pathParts.length > 0) {
      let part = pathParts.shift()

      if (pathParts.length == 0) {
        let active = selected && selected.name == path
        currentLevel.push({ name: part, path: path, active })
      } else {
        let existingPath = _.findWhere(currentLevel, { name: part })

        if (existingPath) {
          currentLevel = existingPath.children
        } else {
          var newPart = {
            name: part,
            directory: true,
            children: [],
            toggled: true,
          }

          currentLevel.push(newPart)
          currentLevel = newPart.children
        }
      }
    }
  })

  return tree
}
