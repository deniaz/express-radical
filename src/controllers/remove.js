function deleteResource (req, res, storage) {
  const id = req.params.id
  if (storage.has(id)) {
    storage.delete(id)
    return res.sendStatus(200)
  }

  return res.sendStatus(404)
}

module.exports = {
  deleteResource,
}
