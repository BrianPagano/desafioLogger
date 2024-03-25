const mongoose = require ('mongoose')
const { dbUser, dbPassword, dbHost, dbName } = require('../configs/app.config')

const mongoConnect = async () => {
    try{
       await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`)
       console.log ('db is connected')
    } catch (error) {
        console.error(error)
    }
}

module.exports = mongoConnect