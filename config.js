var convict = require('convict')

var conf = convict({
  env: {
    doc: "The applicaton environment.",
    format: String,
    default: "development",
    env: "NODE_ENV",
    arg: "node_env"
  },
  database: {
    doc: "",
    format: Object,
    default: {}
  }
})

// Load environment dependent configuration
var env = conf.get('env')
conf.loadFile('./config/datastore.' + env + '.json')

conf.validate({strict: false})

module.exports = conf
