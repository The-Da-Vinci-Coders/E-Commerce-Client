'use strict'

// instantiate mongodb and mongoose
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/mongoose-crud', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
const Place = require('./../../models/place')
const Person = require('./../../models/person')
const { inspect } = require('util')

// open connection to db
db.once('open', function () {
  Place.find().populate('comments.person').populate('owner')
    .then((place) => {
      place.forEach((place) => {
        console.log(inspect(place, { depth: null }))
      })
    })
    .catch(console.error)
    .finally(() => db.close())
  // accept data from the terminal input

  // create a Person

  // close connection to db
  // db.close()
})
