'use strict';

var http = require('http')
var path = require('path')
var fs = require('fs')
var express = require('express')

/**
var grab = require('./grab')
//var biz = 'MjM5OTM3NjIyMA=='
var biz = 'MjM5ODIyMTE0MA==' 
grab(biz, function() {
        console.info('success')
   }
)
**/

var app = express()
var server = http.createServer(app)
var staticPath = path.join(__dirname, '../messages')

app.use(express.static(staticPath))
app.use(express.bodyParser())
app.set('views', staticPath)
app.set('view engine', 'jade')

var index = JSON.parse(fs.readFileSync(path.join(staticPath, 'index.json')))
app.get('/', function(req, res){
  res.render('index', {
      users: index
  })
})

server.listen(9995)


