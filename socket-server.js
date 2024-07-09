const app = require('./app')
const socket = require('socket.io')
const httpServer = require('http').createServer(app)
const fs = require('node:fs')
const io = socket(httpServer, { cors: { "origin": "*" } })


// var socketId;
io.on('connection', (socket) => {
    // socketId = socket.id
    app.set('socket', socket)
    console.log("User Connected")
    socket.on('message', (msg) => {
        fs.writeFile('socketData.txt', msg + "\n", { flag: "a+" }, (err) => {
            if (err) console.log("Error While writing socket Data", err)
            console.log("Data written")
        })
    })
})
module.exports = httpServer

