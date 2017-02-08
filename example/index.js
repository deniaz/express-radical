const express = require('express')
const radical = require('../src')

// You can either regsiter a folder containing all JSON schemas,
const app = radical(express(), 'schemas')

// or register individual schemas directly.
// const app = radical(express(), [
//   require('./schemas/product'),
//   require('./schemas/person'),
// ])

const port = process.env.PORT || 8080
app.listen(port, () => console.info(`Listening on *:${port}`))
