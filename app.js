const express = require('express')
const cors = require('cors')
const path = require('path');
const superagent = require('superagent')
const { createGzip } = require('zlib')
const { createReadStream, createWriteStream } = require('node:fs')
const { pipeline } = require('node:stream')
const { promisify } = require('util')
const tourRouter = require('./routers/tourRouter')
const redisRouter = require('./routers/redisRouter')
const userRouter = require('./routers/userRouter')
const userRouter = require('./routers/userRouter')
const reviewRouter = require('./routers/reviewRouter')
const testRouter = require('./routers/testRouter')
const corsConfig = {
    origin: "*",
    optionSuccessStatus: 200
}


const app = express()
app.use(cors(corsConfig))
app.use(express.json())


app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/redis', redisRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/tests', testRouter)
app.use('/api/v1/download/:filename/:type?', async (req, res) => {
    if (req.params.type == 'zip') {
        const source = createReadStream(req.params.filename, 'utf-8')
        const gzip = createGzip()
        const destination = createWriteStream(`${req.params.filename}.gz`)
        await promisify(pipeline)(source, gzip, destination)
        res.download(`./${req.params.filename}.gz`)
    } else {
        // console.log("File Get", path.resolve(__dirname, req.params.filename))
        // res.setHeader("Cache-Control", "public, max-age=31536000");
        // res.sendFile(`D:\\Angular\\prc-node-basic\\app.js`)
        res.download(`./${req.params.filename}`)
    }

})

app.use('/api/v1/todos', async (req, res) => {
    const data = await superagent.get('https://jsonplaceholder.typicode.com/todos');
    res.status(200).json({
        data: data.body
    })
})

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    if (!Object.prototype.hasOwnProperty.call(err, 'statusCode')) {
        err.statusCode = 500
    }
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        err: err
    })
})

module.exports = app