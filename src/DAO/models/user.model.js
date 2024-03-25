const mongoose = require ('mongoose')

const userColletion = 'user'

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
    },
    age: Number,
    password: String,
    role: {
        type:String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cart',
        default: null,
    },
    githubId: Number,
    githubUsername: String,
})

const Users = mongoose.model (userColletion, userSchema)

module.exports = Users