const UserDao = require ('../DAO/user-dao.mongo')
const messageManager = require('../repositories')
const User = new UserDao()



async function getUserCart(uid) {
    try {
        const user = await User.getUserById(uid)
        return user ? user.cart : null
    } catch (error) {
        throw new Error('Error al obtener el carrito del usuario')
    }
}

async function updateUserCart(uid, cid) {
    try {
        await User.updateUserCart(uid, cid)
    } catch (error) {
        throw new Error('Error al actualizar el carrito del usuario')
    }
}
async function createUser(newUserDto) {
    try {
        const createdUser = await User.createUser(newUserDto);
        //aca va el adapter
        messageManager.sendMessage(createdUser)
        return createdUser;
    } catch (error) {
        console.error('Error al crear un usuario:', error);
        throw new Error('Error al crear un usuario');
    }
}


module.exports = {
    getUserCart,
    updateUserCart,
    createUser,
}
