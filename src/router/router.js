const productsController = require ('../controllers/products.controller')
const cartsController = require ('../controllers/carts.controller')
const addproduct = require('../controllers/addproduct.controller')
const chat = require('../controllers/chat.controller')
const authController = require ('../controllers/auth.controller')
const viewsTemplateController = require ('../controllers/views-template.controller')
const usersController = require ('../controllers/users.controller')

const router = app => {
    app.use('/api/products', productsController)
    app.use('/api/carts', cartsController)
    app.use('/addproduct', addproduct)
    app.use('/chat', chat)
    app.use('/api/auth', authController)
    app.use('/', viewsTemplateController)
    app.use('/api/users', usersController)
}

module.exports = router