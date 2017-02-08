const express = require('express')
const app = express()

const radical = require('../src')
// radical(app, [
//   require('./src/product'),
//   require('./src/person'),
// ])

radical(app, './schemas')

app.get('/', (req, res) => res.sendStatus(418))
app.listen(8080, () => console.info(`Listening on *:8080`))
