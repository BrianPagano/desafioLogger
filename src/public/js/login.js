function submitForm() {
    // Recopila los datos del formulario en un objeto
    const formData = {
        email: document.getElementById('usuario').value.toUpperCase(),
        password: document.getElementById('password').value,
    }

    // Realiza una solicitud POST utilizando fetch y envía los datos en formato JSON
    fetch('/api/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        if (response.ok) { // Verifica si la respuesta indica una solicitud exitosa
            return response.json()
        } else {
            throw new Error('Unauthorized') 
        }
    })
    .then(responseData => {
        // Maneja la respuesta del servidor
        if (responseData.status === 'success') { // Verifica si el inicio de sesión fue exitoso
            window.location.href = '/api/products' // Redirecciona solo si el inicio de sesión fue exitoso
        } 
    })
    .catch(error => {
        console.error('Error:', error)
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Usuario o Contraseña incorrecta",
        })
    })
}

//capturo el span de registrate para cuando hago un click redireccionarlo
const registrate = document.getElementById('Registrate')

//agrego funcion de escucha para cuando hagan click, redireccionar:
registrate.addEventListener('click', () => {
    window.location.href = '/signup'
})