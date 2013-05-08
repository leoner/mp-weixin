'use strict';

var request = require('request')
var fs = require('fs')
var path = require('path')
var _ = require('underscore')
var ini = require('ini')

_.templateSettings = {
  interpolate : /{(.+?)\}/g
}

var messagePath = path.join(__dirname, '..', 'messages')
var MAX_ERROR = 50

var grab = module.exports = function(biz, cb) {
    var errorCount = MAX_ERROR
    var userPath = path.join(messagePath, biz)

    var bizConfig
    if (!fs.existsSync(userPath)) {
        fs.mkdirSync(userPath)
        bizConfig = ini.parse(fs.readFileSync(path.join(messagePath, 'config.ini'), 'utf-8'))
    } else {
        bizConfig = ini.parse(fs.readFileSync(path.join(userPath, 'config.ini'), 'utf-8'))
    }

    var appmsgid = parseInt(bizConfig.appmsgid, 10)

    function getAllArticle(cb) {
        errorCount--
        if (!errorCount) {
            cb()
            return
        }
        getArticle(biz, appmsgid, function(result) {
            if (result) {
                errorCount = MAX_ERROR
            }
            getAllArticle(cb)
            appmsgid++
        })
    }

    getAllArticle(function() {
        bizConfig.appmsgid = appmsgid - MAX_ERROR
        fs.writeFileSync(path.join(userPath, 'config.ini'), ini.stringify(bizConfig))
        cb()
    })
}

var url_tpl = 'http://mp.weixin.qq.com/mp/appmsg/show?__biz={biz}&appmsgid={appmsgid}'
var titleReg = /<title>([^<]+)<\/title>/

function getArticle(biz, appmsgid, cb) {
    var url = _.template(url_tpl, {
         biz: biz,
         appmsgid: appmsgid
    })

    console.info('get ' + url)

    request(url, function(err, res, body) {
        var title = body.match(titleReg)
        if (!title) {
           cb(false)
           return
        }
        title = title[1].replace(/\/|&nbsp;/g, ' ')
        console.info('------>', title)
        var userPath = path.join(messagePath, biz)
        fs.writeFileSync(path.join(userPath, appmsgid + '-' + title + '.html'), body)
        cb(true)
    })
}

//var biz = 'MjM5OTM3NjIyMA=='
//var biz = 'MjM5ODIyMTE0MA=='
//var biz = 'MjM5ODQ2MDIyMA=='
var biz = 'MjM5OTcwNzYwMQ=='
grab(biz, function() {
        console.info('success')
   }
)

