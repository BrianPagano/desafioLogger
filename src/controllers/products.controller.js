const { Router } = require('express')
const router = Router()
const { getProducts } = require('../utils/products.util.js')
const ProductsService = require ('../services/products.service.js')
const authorization = require('../middlewares/authorization-middleware.js')
const generateProducts = require ('../utils/products-mocks.util')
const TYPES_ERROR = require('../handlers/errors/types.errors.js')
const EErrors = require('../handlers/errors/enum-errors.js')
const CustomError = require('../handlers/errors/Custom-Error.js')
const generateProductErrorInfo = require('../handlers/errors/generate-product-error-info.js')

router.get('/', async (req, res) => {
    try {
        const { limit, page, sort, category, stock } = req.query

        const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages } = await getProducts({ limit, page, sort, category, stock })

        // Verifica si la página solicitada es mayor que el número total de páginas disponibles
        if (totalPages && parseInt(page) > totalPages) {
            // Redirige al usuario a la última página disponible
            return res.redirect(`/api/products?page=${totalPages}`)
        }
        const products = docs
        const { user } = req.session

    // Verifica si la página solicitada es mayor que el número total de páginas disponibles
    if (totalPages && parseInt(page) > totalPages) {
    // Redirige al usuario a la última página disponible
    return res.redirect(`/api/products?page=${totalPages}`)
    }

     res.render ('home', { 
        user,
        products,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        limit,
        sort,
         style: 'style.css',})
    } catch (error) {
        req.logger.error ('Error:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/mockingproducts', async (req, res) => {
    try {
        const products = generateProducts()
        //res.json ({message: products})
        res.render ('home', { 
            products,
             style: 'style.css',})
    } catch (error) {
        req.logger.error ('Error al obtener los productos:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})


router.get('/:pid', async (req, res) => {
    try {
        //utilizo params el id
        const { pid } = req.params
        const { user } = req.session
        //realizo una busqueda por id
        const productFilter =  await ProductsService.getProductByID(pid)
        if (!productFilter) {
            return res.status(404).json({ error: 'El producto con el id buscado no existe.'})
        }   res.render ('productFilter', { 
            user,
            productFilter,
            pid,
             style: 'style.css',}) 
    } catch (error) {
        req.logger.error ('Error al obtener el producto:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.post("/", authorization('admin'), async (req, res, next) => {
    try {
      const { code, description, price, stock, thumbnail, title, category } = req.body

      if( !title || !description || !code || !price || !stock || !category ) {
        CustomError.createError({
            name: TYPES_ERROR.PRODUCT_CREATION_ERROR,
            cause: generateProductErrorInfo ({ title, description, code, price, stock, category }),
            message: 'Error al crear el producto',
            code: EErrors.PRODUCT_CREATION_ERROR,
        })
    }
      const result = await ProductsService.addProduct({code,description,price,stock,thumbnail,title,category})
      if (result.success) {
        res.status(201).json({ message: "Producto creado correctamente" })
      } else {
        res.status(400).json({ error: result.message })
      }
      return
    } catch (error) {
        next(error)
    }
})

router.put('/:pid', authorization('admin'), async (req, res) => {
    try {
        const { pid } = req.params
        const { ...product } = req.body
        //valido que se envien todos los campos para actualizar
        if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category) {
            return res.status(404).json ({error: "Todos los campos son obligatorios. Producto no agregado."})
          }
        // Llama al método updateProduct y le envio el producto actualizado y el ID desde los parámetros
        await ProductsService.updateProduct({ ...product, id: pid })
        res.json({ message: 'Producto Actualizado correctamente' })
    } catch (error) {
        req.logger.error ('Error:', error)
        res.status(500).json({ error: 'Error al actualizar el producto.' })
    }
})

router.delete ('/:pid', authorization('admin'), async (req, res) => {
    try {
        const { pid } = req.params
        const result = await ProductsService.deleteProduct(pid)
        if (result === false) {
            return res.status(404).json({ error: 'El producto con el id buscado no existe.'})
        } else {
            res.json({ message: 'Producto borrado correctamente' })
        }
    } catch (error) {
        req.logger.error ('Error:', error)
        res.status(500).json({ error: 'Error al borrar un producto.' })
    }
})


module.exports = router 

