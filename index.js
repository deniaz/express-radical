const express = require('express')
const app = express()

const radical = require('./lib')
// radical(app, [
//   require('./src/product'),
//   require('./src/person'),
// ])

radical(app, './src')

app.get('/', (req, res) => res.sendStatus(418))
app.listen(8080, () => console.info(`Listening on *:8080`))
