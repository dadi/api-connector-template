const fs = require('fs')
const path = require('path')
const colors = require('colors')

const testConfigPath = './config/apiConnector.test.json'
const testConfigSamplePath = './config/apiConnector.test.json.sample'

const testConfigSample = fs.readFileSync(testConfigSamplePath, { encoding: 'utf-8'})

function loadConfig (done) {
  try {
    var testConfig = fs.readFileSync(testConfigPath, { encoding: 'utf-8'})
    return done(JSON.parse(testConfig))
  } catch (err) {
    if (err.code === 'ENOENT') {
      fs.writeFileSync(testConfigPath, testConfigSample)
      console.log()
      console.log("Created file at '" + testConfigPath + "'")
      loadConfig(function (config) {
        testDatabaseSetting(config)
      })
    }
  }
}

function stop () {
  process.exit(1)
}

loadConfig(() => {
  console.log('test/pretest.js: test configuration ready')
})
