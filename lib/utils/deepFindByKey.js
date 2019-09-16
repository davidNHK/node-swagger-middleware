const _ = require("lodash")

function deepFindByKey(targetKey) {
  return object => {
    let target
    _.forEach(object, (value, key) => {
      if (key === targetKey) {
        target = value
        return false
      } else if (_.isObjectLike(value)) {
        target = deepFindByKey(targetKey)(value)
        if (target !== undefined) {
          return false
        }
      }
    })
    return target
  }
}

module.exports = deepFindByKey
