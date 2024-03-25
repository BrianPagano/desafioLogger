function separateStocks(products) {
    const productsInStock = []
    const productsOutOfStock = []

    // Iterar sobre cada producto y clasificarlos en los arrays correspondientes
    products.forEach(product => {
        if (product.product.stock > product.quantity) {
            productsInStock.push(product)
        } else {
            productsOutOfStock.push(product)
        }
    })

    // Devolver los arrays clasificados
    return { productsInStock, productsOutOfStock }
}

module.exports = separateStocks