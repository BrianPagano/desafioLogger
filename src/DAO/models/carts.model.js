const mongoose = require ('mongoose')
const Products = require('./products.model')

const cartsCollection = 'cart'

const cartsSchema = new mongoose.Schema({
    products: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Products, 
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    }],
  });

const Carts = mongoose.model(cartsCollection, cartsSchema)

module.exports = Carts