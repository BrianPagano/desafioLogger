class NewProductDto {
    constructor(newProduct) {
        this.title = newProduct.title
        this.description = newProduct.description
        this.price = newProduct.price
        this.thumbnail = newProduct.thumbnail
        this.code = newProduct.code
        this.stock = newProduct.stock
        this.status = true
        this.category = newProduct.category
    }
}

module.exports = NewProductDto