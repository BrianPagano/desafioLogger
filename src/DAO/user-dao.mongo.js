const Users = require('./models/user.model')

class UserDao {
    async getUserById(uid) {
        try {
            return await Users.findOne({ _id: uid }).exec()
        } catch (error) {
            throw new Error('Error al obtener el usuario de la base de datos')
        }
    }
  
    async updateUserCart(uid, cid) {
        try {
            await Users.updateOne({ _id: uid }, { cart: cid }).exec()
        } catch (error) {
            throw new Error('Error al actualizar el carrito del usuario en la base de datos')
        }
    }
 
    async createUser(newUserDto){
        try {
            const createdUser = await Users.create(newUserDto)
            return createdUser
        } catch (error) {
            throw new Error('Error al crear un usuario')
        }
    }
}


module.exports = UserDao