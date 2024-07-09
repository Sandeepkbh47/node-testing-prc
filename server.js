
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const redis = require('./redis-server')
const httpServer = require('./socket-server')
const fs = require('node:fs')
process.addListener('uncaughtException', (err) => {
    console.log("******UNCAUGHT EXCEPTION*******", err)
})

mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log("Connected to Database. Database Live.")
    stream.close()
    wstream.close()
}).catch(err => {
    console.log('Error connecting to the database', err)

    process.exit(1)
})
redis.connect()
const PORT = process.env.PORT
const server = httpServer.listen(PORT, '0.0.0.0', async () => {
    console.log(`Listening on 0.0.0.0:${PORT}`)
})
process.addListener('unhandledRejection', async (err) => {
    console.log(err.name, err.message)
    server.close(() => {
        console.log("Exiting server")
        process.exit(1)
    })
})

const stream = fs.createReadStream('stream.txt', 'utf-8')


stream.on('data', (dt) => {
    console.log(dt)
    fs.writeFile("socketData.txt", dt, { flag: 'a+' }, (err) => {
        if (err) console.log('Error writing to socketData')
    })
})


const wstream = fs.createWriteStream('stream.txt', { flags: 'a+', encoding: 'utf-8' })
wstream.write(new Date(Date.now()).toString() + "\n")
