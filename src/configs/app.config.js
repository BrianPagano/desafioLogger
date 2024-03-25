require('dotenv').config()

module.exports = {
    port: 8080,
    dbUser: process.env.DB_USER,
    dbPassword:process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    ghClientId: process.env.GITHUB_CLIENT_ID,
    ghClientSecret: process.env.GITHUB_CLIENT_SECRET,
    secret: process.env.SECRET,
    userEmail: process.env.USER_EMAIL, //Usuario de google para enviar correos con mailer
    userPassword: process.env.USER_PASSWORD,
    PortMailer: process.env.PORT_MAILER,
    environment: process.env.NODE_ENV || 'dev',
}

