const generateProductErrorInfo = product => {
    return `one or more properties were incomplete or not valid
    list of required properties:
    * Title   : needs to be a string, received ${product.title},
    * Description   : needs to be a string, received ${product.description},
    * Code   : needs to be a string, received ${product.code},
    * Price   : needs to be a number, received ${product.price},
    * Stock   : needs to be a number, received ${product.stock},
    * Category   : needs to be a string, received ${product.category}
    `
}

module.exports = generateProductErrorInfo