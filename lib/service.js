'use strict';

var http = require('http')
var path = require('path')
var fs = require('fs')
var express = require('express')
var cons = require('consolidate')


var app = express()
var server = http.createServer(app)
var staticPath = path.join(__dirname, '../messages')

app.use(express.bodyParser())
app.engine('html', cons.swig)
app.set('view engine', 'html')
app.set('views', staticPath)

var index = JSON.parse(fs.readFileSync(path.join(staticPath, 'index.json')))
app.get('/', function(req, res){

  res.set('Referer', 'http://www.baidu.com')
  res.render('index', {
      users: index,
      title: '账户列表'
  })
})

app.use(express.static(staticPath))
app.use(express.directory(staticPath))


server.listen(9995)


