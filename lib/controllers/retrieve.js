function getAllResources (req, res, storage) {
  const entities = storage.all()
  return res.status(200).send(entities)
}

function getResource (req, res, storage) {
  const id = req.params.id
  if (storage.has(id)) {
    const entity = storage.get(id)
    return res.status(200).send(entity)
  }

  return res.sendStatus(404)
}

module.exports = {
  getAllResources,
  getResource,
}
