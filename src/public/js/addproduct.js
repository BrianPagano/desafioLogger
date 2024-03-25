function submitForm() {
    // Recopila los datos del formulario en un objeto
    const formData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value,
        code: document.getElementById('code').value,
        stock: document.getElementById('stock').value,
    }

    // Realiza una solicitud POST utilizando fetch y envía los datos en formato JSON
    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
       
          // Muestra un mensaje de alerta
          alert('Producto creado correctamente')  
    })
    .catch(error => console.error('Error:', error))
}
