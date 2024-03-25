const socket = io()

const chatBox = document.getElementById('chatBox')
const messageLogs = document.getElementById('messageLogs')


const getUsername = async () => {
    try {
        const username = await Swal.fire({
            title: 'Bienvenido al Chat',
            text: 'Ingresa tu nombre de usuario para identificarte',
            input: 'text',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
              }
          })
          socket.emit('newUser', {user: username.value})
          socket.on ('userConnected', user => {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
              
              Toast.fire({
                icon: 'success',
                title: `Se acaba de conectar ${user.user}`,
              })
          })

          chatBox.addEventListener('keyup', e => {
            if (e.key === 'Enter') {
                const data = {
                    user: username.value,
                    message: chatBox.value,
                } //aca guardo el valor de todo lo que escribi en el input en un objeto
                chatBox.value = ''
                socket.emit('message', data)
                console.log (data)
            }
        })
          
    } catch (error) {
        console.error (error)
    }
}

getUsername()

socket.on('messageLogs', chats => {
  let messages = ''
  chats.forEach(chat => (messages = `${chat.user} dice: ${chat.message} <hr>` + messages))
  messageLogs.innerHTML = messages
})