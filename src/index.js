const http = require('http')
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

function createRouter ({ validate, plural, storage }) {
  const router = express.Router()

  router.post('/', (req, res) => create.createResource(req, res, validate, storage, plural))
  router.get('/:id', (req, res) => retrieve.getResource(req, res, storage))
  router.get('/', (req, res) => retrieve.getAllResources(req, res, storage))
  router.delete('/:id', (req, res) => remove.deleteResource(req, res, storage))
  router.put('/:id', (req, res) => update.updateResource(req, res, validate, storage, plural))
  router.patch('/:id', (req, res) => update.patchResource(req, res, validate, storage, plural))

  return router
}

function start (app, schemas) {
  const factory = require('./drivers/in-memory')
  app.use(bodyParser.json())

  schemas.map(schema => {
    const validate = validator.compile(schema)
    const name = schema.title.toLowerCase()
    const plural = pluralize(name)
    const storage = factory()

    app.use(`/${plural}`, createRouter({
      validate,
      plural,
      storage,
    }))
  })

  return app
}

function loadSchemas (directory) {
  throw new Error(`Not yet supported due to promises.`)
  // const baseDir = path.join(process.cwd(), directory)
  // const files = fs.readdirSync(baseDir)
  // const schemas = files.map(file => require(
  //   path.join(
  //     baseDir,
  //     file
  //   )
  // ))

  // return schemas
}

function isValidConfig (config) {
  return config.schemas || config.path
}

function init (app, config) {
  if (!isValidConfig(config)) {
    throw new Error('Config must provide either schemas or a path to schemas. None provided.')
  }

  const schemas = config.schemas ? config.schemas : loadSchemas(config.path)
  return start(app, schemas)
}

module.exports = init
