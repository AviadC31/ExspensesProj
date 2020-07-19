const express = require( 'express' )
const app = express()
const bodyParser = require('body-parser')
const api = require( './server/routes/api' )
var mongoose = require('mongoose')
var Expense = require('./server/routes/model/Expense')

mongoose.connect("mongodb://localhost/Expenses")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', api)


app.listen(3000, function () {
    console.log("Server up and running on port 3000")
  })
