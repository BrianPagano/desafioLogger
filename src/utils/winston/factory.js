const { environment } = require ('../../configs/app.config')
trimmedEnvironment = environment.trim()

switch (trimmedEnvironment) {
    case 'dev':
      module.exports = require('./devLogger')
      break
  
    case 'prod':
      module.exports = require('./prodLogger')
      break
  }