const { createHash } = require('../utils/cryp-password.util')

class NewUserDTO {
    constructor(NewUser, password) {
        this.first_name = NewUser.first_name
        this.last_name = NewUser.last_name
        this.age = NewUser.age
        this.email = NewUser.email
        this.password =  createHash (password)
    }
}

module.exports = NewUserDTO