const convict = require('convict')
const conf = convict({
  env: {
    doc: 'The applicaton environment.',
    format: String,
    default: 'development',
    env: 'NODE_ENV',
    arg: 'node_env'
  },
  database: {
    doc: '',
    format: Object,
    default: {}
  }
})

// Load environment dependent configuration
const env = conf.get('env')
conf.loadFile('./config/apiConnector.' + env + '.json')

module.exports = conf
