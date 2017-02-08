const fs = require('fs')
const http = require('http')
const path = require('path')
const Ajv = require('ajv')
const express = require('express')
const bodyParser = require('body-parser')
const pluralize = require('pluralize')

const create = require('./controllers/create')
const retrieve = require('./controllers/retrieve')
const remove = require('./controllers/remove')
const update = require('./controllers/update')

const validator = new Ajv({
  allErrors: true,
  jsonPointers: true,
  loadSchema: (uri, callback) => {
    http.get(uri, res => {
      if (res.statusCode >= 400) {
        return callback(new Error(`Failed to load remote reference from ${uri}`))
      }

      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        const response = JSON.parse(data)
        return callback(null, response)
      })
    }).on('error', err => callback(err))
  }
})

function start (app, schemas) {
  const factory = require('./drivers/in-memory')
  app.use(bodyParser.json())

  schemas.map(schema => {
    console.log(`Registering ${schema.title}`)
    validator.compileAsync(schema, (err, validate) => {
      if (err) {
        console.log(err)
      }

      const name = schema.title.toLowerCase()
      const plural = pluralize(name)

      const router = express.Router()
      const storage = factory()
      // res.append('Via', '1.0.0-alpha RAD Shit');
      router.post('/', (req, res) => create.createResource(req, res, validate, storage, plural))
      router.get('/:id', (req, res) => retrieve.getResource(req, res, storage))
      router.get('/', (req, res) => retrieve.getAllResources(req, res, storage))
      router.delete('/:id', (req, res) => remove.deleteResource(req, res, storage))
      router.put('/:id', (req, res) => update.updateResource(req, res, validate, storage, plural))
      router.patch('/:id', (req, res) => update.patchResource(req, res, validate, storage, plural))

      app.use(`/${plural}`, router)
    })
  })
}

module.exports = (app, schemas) => {
  if (typeof schemas === 'string') {
    const baseDir = path.join(process.cwd(), schemas)
    schemas = []

    fs.readdir(baseDir, (err, files) => {
      if (err) {
        throw err
      }

      files.forEach(file => schemas.push(
        require(path.join(
          baseDir,
          file
        ))
      ))

      start(app, schemas)
    })
  } else if (Array.isArray(schemas)) {
    start(app, schemas)
  } else {
    throw new Error(`Second param must be either a path or a array of schemas.`)
  }

  return app
}
