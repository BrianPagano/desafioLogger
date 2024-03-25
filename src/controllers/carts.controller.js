const { Router } = require('express')
const router = Router()

const CartService = require ('../services/cart.service.js')
const ProductsService = require ('../services/products.service.js')
const calculateSubtotalAndTotal = require('../utils/calculoTotales-Cart.util.js')
const authorization = require('../middlewares/authorization-middleware.js')
const NewPurchaseDTO = require('../DTO/new-purchase.dto.js')
const separateStocks  = require('../utils/separateStocks.util')
const CustomError = require('../handlers/errors/Custom-Error')
const TYPES_ERROR = require('../handlers/errors/types.errors')
const EErrors = require('../handlers/errors/enum-errors')


//mostrar el carrito elegido
router.get('/:cid', async (req, res) => {
    try {
        //utilizo params el id
        const { cid } = req.params
        const { user } = req.session
        //realizo una busqueda por id
        const filterById =  await CartService.getCartByID(cid)
        if (!filterById) {
            return res.status(404).json({ error: 'El carrito con el ID buscado no existe.'})
        } else {
            // Calcular los subtotales y el total del carrito
            const { subtotal, total } = calculateSubtotalAndTotal(filterById.products)
              res.render ('cart', { 
                user,
                subtotal,
                filterById,
                total,
                style: 'style.css',})
        }
    } catch (error) {
        req.logger.error ('Error al obtener el carrito:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//mostrar el ticket creado
router.get('/:cid/purchase', async (req, res) => {
    try {
        const { cid } = req.params
        const { user } = req.session
        const { total, orderNumber } = req.query
        const filterById =  await CartService.getCartByID(cid)
        if (!filterById || !user) {
            return res.status(404).json({ error: 'Error a ver la orden de compra.'})
        } 
        res.render ('ticket', { 
            user,
            total,
            orderNumber,
            style: 'style.css',})
    } catch (error) {
        req.logger.error ('Error al obtener el ticket ya creado:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//crear un carrito
router.post('/', async (req, res) => {
    try {
        const result = await CartService.addCart() // Capturar el resultado de addCart()
        res.status(201).json({ message: 'Carrito creado correctamente', cid: result.cid })
    } catch (error) {
        req.logger.error ('Error al cargar los productos:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//agregar producto indicando el carrito (cid) y el producto (pid)
router.post('/:cid/products/:pid', authorization('user'), async (req, res, next) => {
    try {
        const { cid, pid } = req.params
        const product = await ProductsService.getProductByID(pid)

        if (!product) {
            CustomError.createError({
                name: TYPES_ERROR.PRODUCT_NOT_FOUND,
                cause: 'El producto con el ID proporcionado no existe.',
                message: 'El producto con el ID proporcionado no existe.',
                code: EErrors.NOT_FOUND,
            })
        }

        const result = await CartService.addProductInCart(cid, pid)
        if (result.success) {
            // Actualizar el valor de user.cart en la sesión del usuario
            req.session.user.cart = cid
            res.status(201).json({ message: result.message })
        } else {
            CustomError.createError({
                name: TYPES_ERROR.INTERNAL_SERVER_ERROR,
                cause: 'Error al agregar el producto al carrito.',
                message: result.message,
                code: EErrors.INTERNAL_SERVER_ERROR,
            })
        }
    }  catch (error) {
        next(error)
    }
})

//crear una orden de compra
router.post('/:cid/purchase', async (req, res) => {
    try {
        const { cid } = req.params
        const { user } = req.session
        const filterById =  await CartService.getCartByID(cid)
        if (!filterById) {
            return res.status(404).json({ error: 'El carrito con el ID buscado no existe.'})
        }   
        // evaluar stock y divido en 2 arrays
        const { productsInStock, productsOutOfStock } = separateStocks(filterById.products)
        // descuento del stock los productos comprados
        await ProductsService.updateStock(productsInStock)
        // actualizo el carrito con los productos solo sin stock
        const updatedCart = await CartService.updateCart(cid, productsOutOfStock)
        if (!updatedCart.success) {
            return res.status(500).json({ error: updatedCart.message })
        }
        // Calcular el total del carrito
        const { total }  = calculateSubtotalAndTotal(productsInStock)
        const NewTicketInfo = new NewPurchaseDTO (total, user)
        const order = await CartService.createPurchase(NewTicketInfo) 
        const orderNumber = order.createdOrder.code
        res.status(201).json({ 
            message: 'ticket creado correctamente',
            total: total,
            orderNumber: orderNumber,
        })    
    } catch (error) {
        req.logger.error ('Error:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//actualizar producto pasando el cid y pid
router.put('/:cid/products/:pid', authorization('user'), async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body

        const result = await CartService.updateProductQuantity(cid, pid, quantity)

        if (result.success) {
            res.status(200).json({ message: result.message })
        } else {
            res.status(500).json({ error: result.message })
        }
        } catch (error) {
            req.logger.error ('Error al actualizar la cantidad de productos:', error)
            res.status(500).json({ error: 'Internal Server Error' })
        }
})



//borrar un solo producto del carrito enviando por parametros el cid y pid
router.delete('/:cid/products/:pid', authorization('user'), async (req, res) => {
    try {
        const { cid, pid } = req.params
        const result = await CartService.deleteProductInCart(cid, pid)

        if (result.success) {
            res.status(201).json({ message: result.message })
        } else {
            res.status(500).json({ error: result.message })
        }
    } catch (error) {
        req.logger.error ('Error al eliminar un producto:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//delete de todos los productos del carrito
router.delete('/:cid', authorization('user'), async (req, res) => {
    try {
        const { cid } = req.params
        const result = await CartService.deleteProductsInCart(cid)

        if (result.success) {
            res.status(201).json({ message: result.message })
        } else {
            res.status(500).json({ error: result.message })
        }
    } catch (error) {
        req.logger.error ('Error al eliminar todos los productos:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

module.exports = router
 