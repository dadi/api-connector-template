#! /usr/bin/env node

var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')

var currentPath = process.cwd()
var configPath = path.join(__dirname, '../config/datastore.development.json.sample')
var destinationDir = path.join(currentPath, '../../../config')
var destinationFile = path.join(destinationDir, 'datastore.development.json')

mkdirp(destinationDir, (err, made) => {
  if (err) throw err

  fs.readFile(configPath, (err, data) => {
    if (err) throw err

    fs.writeFile(destinationFile, data, (err) => {
      if (err) throw err

      console.log('Configuration created at', destinationFile)
    })
  })
})
