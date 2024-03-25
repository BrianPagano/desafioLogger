const CartDao = require ('../DAO/cart-dao.mongo')
const NewPurchaseDTO = require('../DTO/new-purchase.dto')
const Cart = new CartDao()

const addCart = async () => {
    try {
      const result = await Cart.addCart()
      return result
    } catch (error) {
        console.error (error)
      } 
  }

 const getCartByID = async cid => {
  try {
       const findCart = await Cart.getCartByID(cid)
       return findCart
   } catch (error) {
       console.error (error)
     }  
 }

 const addProductInCart = async (cid,pid) => {
    try {
         const result = await Cart.addProductInCart(cid,pid)
         return result
     } catch (error) {
         console.error (error)
       }  
   }

  const createPurchase = async (NewPurchaseDTO) => {
    try {
      const result = await Cart.createPurchase(NewPurchaseDTO)
      return result
  } catch (error) {
      console.error (error)
    }  
}

   const updateCart = async (cid, updatedProducts) => {
    try {
         const result = await Cart.updateCart(cid, updatedProducts)
         return result
     } catch (error) {
         console.error (error)
       }  
   }

   const updateProductQuantity = async (cid, pid, quantity) => {
    try {
         const result = await Cart.updateProductQuantity(cid, pid, quantity)
         return result
     } catch (error) {
         console.error (error)
       }  
   }

   const deleteProductInCart = async (cid, pid) => {
    try {
        const result = await Cart.deleteProductInCart(cid, pid)
        return result
    } catch (error) {
        console.error (error)
      }  
   }
  
   const deleteProductsInCart = async (cid) => {
    try {
        const result = await Cart.deleteProductsInCart(cid)
        return result
    } catch (error) {
        console.error (error)
      }  
   }

  module.exports = {
    addCart, getCartByID, addProductInCart, updateCart, updateProductQuantity, deleteProductInCart, deleteProductsInCart, createPurchase
  }