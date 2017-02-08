function createResource (req, res, validate, storage, collectionName) {
  const body = req.body
  const isValid = validate(body)

  if (!isValid) {
    return res.status(400).json(validate.errors)
  }

  const id = storage.create(body)
  return res.status(201).location(`/${collectionName}/${id}`).send()
}

module.exports = {
  createResource: createResource,
}
