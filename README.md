# Radical
Simple, opinionated RAD middleware for express.

Radical builds a RESTful API on top of express, based on your JSON Schemas.
Different drivers for data storage are available (In-Memory, ~~Mongo~~, ~~Redis~~, ~~Postgres~~).

Rather than building your mock API time and time again, just throw some schemas at Radical
and let it do its magic.  

*Batches*

* Installation
* Usage
* Options
* License
* Author

## Installation
```
npm install express-radical
```

## Usage
```
const express = require('express')
const radical = require('express-radical')

const app = radical(express(), 'path/to/schemas')
app.listen(process.env.PORT || 8080, () => console.log(`(Radical) express listening on *:${process.env.PORT || 8080}`)
```
## Features
* Automatically routes `GET`, `POST`, `PUT`, `PATCH` and `DELETE` verbs
* When creating a resource, the JSON payload will be validated against your schema

## Options
* Path to schemas
* single schemas

## License
[MIT License](https://opensource.org/licenses/MIT)

## Author
[Robert Vogt](https://twitter.com/_deniaz)