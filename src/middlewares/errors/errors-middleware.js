const EErrors = require("../../handlers/errors/enum-errors")

const errorMiddleware = (error, req, res, next) => {
    if (error) {
        req.logger.error('El error es:', error)
        if (error.code) {
            switch (error.code) {
                case EErrors.INVALID_USER_INFO:
                    res.status(EErrors.INVALID_USER_INFO).json({ status: 'error', error: error.message })
                    break
                case EErrors.NOT_FOUND:
                    res.status(EErrors.NOT_FOUND).json({ status: 'error', error: error.message })
                    break
                case EErrors.PRODUCT_CREATION_ERROR:
                    res.status(EErrors.PRODUCT_CREATION_ERROR).json({ status: 'error', error: error.message })
                    break
                case EErrors.SERVER_GATEWAY_ERROR:
                    res.status(EErrors.SERVER_GATEWAY_ERROR).json({ status: 'error', error: error.message })
                    break
                case EErrors.NOT_AUTHORIZED:
                    res.status(EErrors.NOT_AUTHORIZED).json({ status: 'error', error: error.message })
                    break
                case EErrors.PRODUCT_NOT_FOUND:
                    res.status(EErrors.PRODUCT_NOT_FOUND).json({ status: 'error', error: error.message })
                    break
                default:
                    res.status(EErrors.INTERNAL_SERVER_ERROR).json({ status: 'error', error: 'Internal server error' })
                    break
            }
        } else {
            // Si error.code no está definido, envía una respuesta con un estado de error interno del servidor
            res.status(EErrors.INTERNAL_SERVER_ERROR).json({ status: 'error', error: 'Internal server error' })
        }
    } else {
        // Si error es undefined, envía una respuesta con un estado de error interno del servidor
        res.status(EErrors.INTERNAL_SERVER_ERROR).json({ status: 'error', error: 'Internal server error' })
    }
}

module.exports = errorMiddleware
