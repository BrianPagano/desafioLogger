const { Router } = require('express')
const router = Router()
const passport = require ('passport')
const UserService = require ('../services/user.service')
const CustomError = require('../handlers/errors/Custom-Error')
const TYPES_ERROR = require('../handlers/errors/types.errors')
const EErrors = require('../handlers/errors/enum-errors')



router.get ('/user-cart', async (req, res, next) => {
    try {
        // Recuperar el valor cid de la sesión del usuario
        const cid = req.session.cart
        if (!cid) {
            // Verificar si existe un usuario autenticado en la sesión
            if (!req.user) {
                throw new CustomError({
                    name: TYPES_ERROR.NOT_AUTHORIZED,
                    cause: 'No estás autenticado',
                    message: 'No estás autenticado',
                    code: EErrors.NOT_AUTHORIZED,
                })
            }
            const uid = req.user._id
            const userCart = await UserService.getUserCart(uid)
            if (!userCart) {
                CustomError.createError({
                    name: TYPES_ERROR.USER_NOT_EXIST,
                    cause: 'No se encontro el usuario en la base de datos',
                    message: 'El usuario no existe',
                    code: EErrors.NOT_FOUND,
                })
                return
            }
            res.status(200).json({status: 'success', cid: userCart})
        }
    }  catch (error) {
        // Pasar el error al middleware para su manejo
        next(error)
    }
})


router.post ('/', passport.authenticate('register', {failureRedirect: '/api/users/fail-Register'}),  async (req, res) => {
    try {
        res.status(201).json ({status: 'success', message: 'Usuario' })
     } catch (error) {
        req.logger.error ('Error en la authenticacion de usuario:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get ('/fail-Register', (req, res) => {
    req.logger.info ('fallo el registro de usuario')
    res.status(400).json({status: 'error',  error: 'bad Request' })
})

//actualizar el user con el carrito creado
router.put('/', async (req, res) => {
    try {
        const uid = req.user._id
        const { cart: cid } = req.body
        // Actualiza el carrito del usuario en la base de datos
        await UserService.updateUserCart(uid, cid)
        // Enviar una respuesta al cliente
        res.status(200).json({ status: 'success', message: 'User cart updated successfully' })
    } catch (error) {
        req.logger.error ('Error al actualizar el carrito del usuario:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

module.exports = router