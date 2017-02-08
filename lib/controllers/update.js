function updateResource (req, res, validate, storage, collectionName) {
  const id = req.params.id
  if (!storage.has(id)) {
    return res.sendStatus(404)
  }

  const body = req.body

  const isValid = validate(body)

  if (!isValid) {
    return res.status(400).json(validate.errors)
  }

  storage.update(id, body)
  return res.status(200).location(`/${collectionName}/${id}`).send()
}

function patchResource (req, res, validate, storage, collectionName) {
  const id = req.params.id
  if (!storage.has(id)) {
    return res.sendStatus(404)
  }

  const delta = req.body
  const existing = storage.get(id)

  const updated = Object.assign({}, existing, delta)
  const isValid = validate(updated)

  if (!isValid) {
    return res.status(400).json(validate.errors)
  }

  storage.update(id, updated)
  return res.status(200).location(`/${collectionName}/${id}`).send()
}

module.exports = {
  updateResource,
  patchResource
}
