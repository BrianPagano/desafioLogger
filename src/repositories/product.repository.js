const ProductDao = require('../DAO/product-dao.mongo')

class ProductRepository {
    constructor() {
        this.productDao = new ProductDao()
    }

    async getProductByID(id) {
        try {
            return await this.productDao.getProductByID(id)
        } catch (error) {
            console.error (error)
        }
    }

    async addProduct(product) {
        try {
            return await this.productDao.addProduct(product)
        } catch (error) {
            console.error (error)
        }
    }

    async updateProduct(productUpdated) {
        try {
            await this.productDao.updateProduct(productUpdated)
        } catch (error) {
            console.error (error)
        }
    }

    async deleteProduct(pid) {
        try {
            return await this.productDao.deleteProduct(pid)
        } catch (error) {
            console.error (error)
        }
    }

    async updateStock (productsInStock) {
        try {
            await this.productDao.updateStock(productsInStock) 
        } catch (error) {
            console.error (error)
          }  
       }
}

module.exports = ProductRepository
