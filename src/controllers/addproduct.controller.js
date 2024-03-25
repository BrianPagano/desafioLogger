const { Router } = require('express')
const router = Router()
const authorization = require('../middlewares/authorization-middleware')

router.get('/', authorization('admin'), async (req, res) => {
    try {
     const { user } = req.session
     res.render ('addProduct', {
        user,
        style:'style.css'})   
    } catch (error) {
        req.logger.error ('Error al crear productos:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

module.exports = router
