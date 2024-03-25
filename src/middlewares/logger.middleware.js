const getLogger = require ('../utils/winston/factory')

const logger = (req, res, next) => {    
    req.logger = getLogger
    next()
}

module.exports = logger



