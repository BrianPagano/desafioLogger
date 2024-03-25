const { Router } = require('express')
const router = Router()
const authorization = require('../middlewares/authorization-middleware.js')

router.get('/', authorization('user'), async (req, res) => {
    try {
     res.render ('chat', {style:'style.css'})   
    } catch (error) {
        req.logger.error ('Error al cargar el chat:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})


module.exports = router