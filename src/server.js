const express = require('express')
const router = require('./router/router')
const { port } = require('./configs/app.config')
const { Server } = require("socket.io")
const handlebars = require('express-handlebars')
const mongoConnect = require('./db')
const chats = []
const Messages = require ('./DAO/models/messages.model')
const session = require('express-session')
const initializePassport = require('./configs/passport.config')
const passport = require('passport')
const errorMiddleware = require('./middlewares/errors/errors-middleware')
const logger = require('./middlewares/logger.middleware')



const app = express()

// Configuración de Handlebars
const hbs = handlebars.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
})

// Definición del helper multiply
hbs.handlebars.registerHelper('multiply', function(a, b) {
  return a * b
})

// Define helper iqual
hbs.handlebars.registerHelper('isEqual', function(arg1, arg2, options) {
  return (arg1 === arg2) ? options.fn(this) : options.inverse(this)
})

app.use(express.json())
app.use(express.static(process.cwd() + '/src/public'))
app.use(express.urlencoded ({extended : true}))
app.use(session ({
  secret: 'secretCoder',
  resave: true,
  saveUninitialized: true,
}))

// Configura Express para servir archivos estáticos desde la carpeta 'node_modules/bootstrap/dist'
app.use('/bootstrap', express.static(process.cwd() + '/node_modules/bootstrap/dist'))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars', hbs.engine)
app.set('views', process.cwd() + '/src/views')
app.set('view engine', 'handlebars')

app.use(logger)

const httpServer = app.listen(port, () => {
  console.log(`Server running at port ${port}`)
})

const io = new Server(httpServer)

io.on ('connection', (socket) => {  
  socket.on('newUser', data => {
    socket.broadcast.emit ('userConnected', data)
    socket.emit ('messageLogs', chats)
    
  })
  socket.on ('message', async data => {
    chats.push(data) //aca guardo la data en un array
    io.emit ('messageLogs', chats) 
    try {
      const NewMessage = {
        user: data.user,
        message: data.message,
      }
      await Messages.create(NewMessage)
    } catch(error){
      console.log (error)
    }
  })
})

app.locals.io = io

mongoConnect()

router(app)

app.use(errorMiddleware)






