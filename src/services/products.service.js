const ProductRepository = require ('../repositories/product.repository')
const productReposity = new ProductRepository()

const getProductByID = async pid => {
    try {
      const findID = await productReposity.getProductByID(pid)
      return findID
    } catch (error) {
        console.error (error)
        return {error: true}
      } 
  }

const addProduct = async product => {
 try {
      const result = await productReposity.addProduct(product) 
      return result
  } catch (error) {
      console.log (error)
    }  
}

const updateProduct = async productUpdated => {
  try {
       await productReposity.updateProduct(productUpdated) 
   } catch (error) {
       console.error (error)
     }  
 }

 const deleteProduct = async pid => {
  try {
       const result = await productReposity.deleteProduct(pid) 
       return result
   } catch (error) {
       console.error (error)
     }  
 }
 
 const updateStock = async productsInStock => {
  try {
      const result = await productReposity.updateStock(productsInStock) 
      return result
  } catch (error) {
      console.error (error)
    }  
 }
 
  module.exports = {
    getProductByID, addProduct, updateProduct, deleteProduct, updateStock
  }