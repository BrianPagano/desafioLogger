document.addEventListener('DOMContentLoaded', async () => {
    const cartButton = document.getElementById('cart')
    if (cartButton) {
        cartButton.addEventListener('click', async () => {
            try {
                const response = await fetch(`/api/users/user-cart`, {
                    method: 'GET',
                })
                const data = await response.json()
                const cid = data.cid
                if (!cid) { 
                    window.location.href = `/login`
                    return
                }
                window.location.href = `/api/carts/${cid}`
            } catch (error) {
                console.error(error)
            }
        })
    }

    const cancelarCompraButton = document.querySelector('.cancelarCompra')
    if (cancelarCompraButton) {
        cancelarCompraButton.addEventListener('click', function() {
            try {
                const cid = this.dataset.cid

                // Realizar una solicitud Fetch para cancelar la compra
                fetch(`/api/carts/${cid}`, {
                    method: 'DELETE',
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    window.location.reload()
                })
            } catch (error) {
                console.error('Error al procesar la solicitud:', error)
            }
        })
    }

    document.querySelectorAll('.iconoBasura').forEach(function(button) {
        button.addEventListener('click', function() {
            const cid = this.dataset.cid
            const pid = this.dataset.pid

            // Realizar una solicitud Fetch para cancelar la compra
            fetch(`/api/carts/${cid}/products/${pid}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                window.location.reload()
            })
            .catch(error => {
                console.error('Error al cancelar la compra:', error)
            })
        })
    })

    const finalizarCompra = document.getElementById('finalizarCompra')
    if (finalizarCompra) {
        finalizarCompra.addEventListener('click', async function() {
            const cid = this.dataset.cid
            try {    
                const response = await fetch(`/api/carts/${cid}/purchase`, {
                    method: 'POST',
                })
    
                if (!response.ok) {
                    throw new Error('La solicitud no fue exitosa')
                }
                const data = await response.json()
                const total = data.total
                const orderNumber = data.orderNumber
                // Redirigir al endpoint de compra con los parámetros necesarios
                window.location.href = `/api/carts/${cid}/purchase?total=${total}&orderNumber=${orderNumber}`
            } catch (error) {
                console.error('Error al finalizar la compra:', error)
            }
        })
    }
    
})