
import _ from 'underscore'

/**
* Extract switch names from pages
* @param {Object} page page definig state, conditions and actions
* @return {Array<String>} switch names
*/
export function extractSwitchNames(pages) {
  let switches = []
  for (var i = 0; i < pages.length; i++) {
    let conditions = pages[i].conditions || []
    for (var j = 0; j < conditions.length; j++) {
      let { key, type } = conditions[j]
      if (type == 'switch') {
        switches.push(key)
      }
    }
  }
  return switches
}

export function conditionsAreMeet(conditions, context) {
  let logicOutput = conditions.map((condition) => {
    if (condition.type == 'switch') {
      return context.switches.get(condition.key) == condition.state
    } else {
      throw `Unsuported type: ${JSON.stringify(condition)}`
    }
  })

  logicOutput = _.uniq(logicOutput)
  return (logicOutput.length == 1 && logicOutput[0])
}

/**
* Find page that meets current conditions
* @return {Integer} page number
*/
export function checkPagesConditions({ pages, context }) {
  for (var pageIndex = pages.length -1; pageIndex >= 0; pageIndex--) {
    let { conditions } = pages[pageIndex]
    if (conditions == null || conditions.length == 0) {
      return pageIndex
    } else if (conditionsAreMeet(conditions, context)) {
      return pageIndex
    }
  }

  return 0
}
