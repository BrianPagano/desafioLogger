const { v4: uuidv4 } = require('uuid')

class NewPurchaseDTO {
    constructor(totalPrice,user) {
        this.code = uuidv4()
        this.amount = totalPrice
        this.purchaser = user.email
    }
}

module.exports = NewPurchaseDTO