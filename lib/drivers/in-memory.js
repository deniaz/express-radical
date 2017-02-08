const uuid = require('uuid/v4')

function create (data, dictionary) {
  const id = uuid()
  dictionary.set(id, Object.assign(data, { id }))
  return id
}

function update (id, data, dictionary) {
  dictionary.set(id, data)
  return id
}

function get (id, dictionary) {
  return dictionary.get(id)
}

module.exports = () => {
  const dictionary = new Map()

  return {
    create: data => create(data, dictionary),
    update: (id, data) => update(id, data, dictionary),
    get: id => get(id, dictionary),
    has: id => dictionary.has(id),
    delete: id => dictionary.delete(id),
    all: () => Array.from(dictionary.values()),
  }
}
