document.querySelectorAll('.botonAgregarCarrito').forEach(function(button) {
    button.addEventListener ('click', async function() {
      let pid = this.dataset.pid
      let cid = this.dataset.cid
  
     if (!cid) {
      try {
       const response = await fetch(`/api/users/user-cart`, {
          method: 'GET',
        })
        data = await response.json()
        cid = data.cid
      } catch (error){
        console.error (error)
      }
    }
      
      if (!cid) {
  
        // Realizar una solicitud POST para crear un id de carrito vacio
        fetch(`/api/carts`, {
          method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          cid = data.cid       // Actualizar el CID con el valor devuelto por la solicitud
          // Realizar la solicitud Fetch para actualizar el usuario y asignarle el ID del carrito
          fetch(`/api/users/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cart: cid })
          })
          .then(response => response.json())
          .then(updatedUser => {
            console.log('Usuario actualizado con éxito:', updatedUser)
            // Ahora que has actualizado el usuario con el ID del carrito, puedes agregar el producto al carrito
            agregarProductoAlCarrito(cid, pid)
          })
          .catch(error => {
            console.error('Error al actualizar el usuario:', error)
          })
        })
        .catch(error => {
          console.error('Error al crear el carrito:', error)
        })
      } else {
        // Si ya hay un CID, agregar el producto al carrito directamente
        agregarProductoAlCarrito(cid, pid)
      }
    })
  })
  
  function agregarProductoAlCarrito(cid, pid) {
    fetch(`/api/carts/${cid}/products/${pid}`, {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
  
        Toast.fire({
            icon: 'success',
            title: `Producto agregado correctamente`,
        })
    })
    .catch(error => {
        console.error('Error al cancelar la compra:', error)
    })
  }