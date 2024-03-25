const Carts = require('./models/carts.model')
const Tickets = require ('./models/purchase.model.js')
const ProductsService = require ('../services/products.service.js')
const mongoose = require('mongoose')


class CartDao {

    async addCart() {
        try {
            const newCart = {
                products: []
            }
    
            // Crear el carrito y capturar su ID
            const createdCart = await Carts.create(newCart)
    
            // Obtener el ID del carrito creado
            const cartId = createdCart._id
            console.log ('El cart id es:', cartId)
    
            return { success: true, message: 'Carrito creado correctamente', cid: cartId }
        } catch (error) {
            console.error('Error al crear el carrito:', error.message)
            return { success: false, message: 'Error interno al procesar la solicitud.' }
        }
    }

    async getCartByID (id) {
        try {
          const findCart = await Carts.findOne({ _id: id}).populate('products.product')
          if (findCart) return findCart
        } catch (error) {
            console.log ('Error al obtener los productos del carrito:', error.message)
          } 
      }

    
    async addProductInCart(cid, pid) {
        try {
            // Verificar si el carrito existe
            const cart = await Carts.findById(cid)

            if (cart) {
                // Verificar si el producto existe en la lista de productos generales
                const product = await ProductsService.getProductByID(pid)

                if (product) {
                // Verificar si el producto ya está en el carrito
                    const productIndex = cart.products.findIndex(prod => prod.product.toString() === pid.toString())

                    if (productIndex !== -1) {
                        // Si el producto ya está en el carrito, incrementar la cantidad
                        cart.products[productIndex].quantity++
                    } else {
                        // Si el producto no está en el carrito, agregarlo
                        cart.products.push({ product: new mongoose.Types.ObjectId(pid), quantity: 1 })
                    }

                    // Guardar el carrito actualizado en la base de datos
                    await cart.save()
                    console.log('Producto agregado al carrito con éxito')
                    return { success: true, message: 'Producto agregado correctamente al carrito' }
                } else {
                    console.log('El producto no existe en la base de datos')
                    return { success: false, message: 'El producto no existe en la lista general de productos.' }
                }
            } else {
                console.log('El carrito no existe en la base de datos')
                return { success: false, message: 'carrito no encontrado.' }
            }
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error)
            return { success: false, message: 'internal server error' }
        }
    }

    async updateCart(cid, productsOutOfStock) {
        try {
            // Verificar si el carrito existe
            const cart = await Carts.findById(cid)
    
            if (cart) {
                // Limpiar el carrito eliminando todos los productos existentes
                cart.products = []
                
                // Agregar los productos que quedaron sin stock al carrito
                productsOutOfStock.forEach(product => {
                    cart.products.push({
                        product: new mongoose.Types.ObjectId(product.product._id),
                        quantity: product.quantity
                    })
                })
                // Guardar el carrito actualizado en la base de datos
                await cart.save()
                
                console.log('Carrito actualizado con productos sin stock')
                return { success: true, message: 'Carrito actualizado con productos sin stock' }
            } else {
                console.log('El carrito no existe en la base de datos')
                return { success: false, message: 'Carrito no encontrado.' }
            }
        } catch (error) {
            console.error('Error al actualizar el carrito:', error)
            return { success: false, message: 'Error interno del servidor' }
        }
    }
    

  async updateProductQuantity(cid, pid, quantity) {
    try {
        const cart = await Carts.findById(cid)

        if (cart) {
            const productIndex = cart.products.findIndex(prod => prod.product.toString() === pid.toString())

            if (productIndex !== -1) {
                // Actualizar la cantidad del producto en el carrito
                cart.products[productIndex].quantity = quantity

                // Guardar el carrito actualizado en la base de datos
                await cart.save()
                console.log('Cantidad de producto actualizada con éxito')
                return { success: true, message: 'Cantidad de producto actualizada correctamente' }
            } else {
                console.log('El producto no está en el carrito')
                return { success: false, message: 'El producto no está en el carrito.' }
            }
        } else {
            console.log('El carrito no existe en la base de datos')
            return { success: false, message: 'Carrito no encontrado.' }
        }
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto:', error)
        return { success: false, message: 'Internal server error' }
    }
}
        

    async deleteProductInCart(cid, pid) {
        try {
            // Verificar si el carrito existe
            const cart = await Carts.findById(cid)

            if (cart) {
                // Verificar si el producto ya está en el carrito
                const productIndex = cart.products.findIndex(prod => prod.product.toString() === pid.toString())

                if (productIndex !== -1) {
                    // Eliminar completamente el producto del carrito
                    cart.products.splice(productIndex, 1)

                    // Guardar el carrito actualizado en la base de datos
                    await cart.save()
                    console.log('Producto eliminado del carrito con éxito')
                    return { success: true, message: 'Producto eliminado correctamente del carrito' }
                } else {
                    console.log('El producto no está en el carrito')
                    return { success: false, message: 'El producto no está en el carrito.' }
                }
            } else {
                console.log('El carrito no existe en la base de datos')
                return { success: false, message: 'Carrito no encontrado.' }
            }
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error)
            return { success: false, message: 'Internal server error' }
        }
    }
        
  async deleteProductsInCart(cid) {
    try {
        // Verificar si el carrito existe
        const cart = await Carts.findById(cid)

        if (cart) {

            cart.products = []

            // Guardar el carrito actualizado en la base de datos
            await cart.save()
            console.log('Productos eliminados del carrito con éxito')
            return { success: true, message: 'Productos eliminados correctamente del carrito' }
        } else {
            console.log('El carrito no existe en la base de datos')
            return { success: false, message: 'Carrito no encontrado.' }
        }
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error)
        return { success: false, message: 'Internal server error' }
    }
  }

  async createPurchase(NewPurchaseDTO) {
    try {
        const createdOrder = await Tickets.create(NewPurchaseDTO)
        return { success: true, message: 'ticket creado correctamente', createdOrder}
    } catch (error) {
        console.error('Error al crear el ticket', error.message)
        return { success: false, message: 'Error interno al procesar la solicitud.' }
    }
}

}




module.exports = CartDao


