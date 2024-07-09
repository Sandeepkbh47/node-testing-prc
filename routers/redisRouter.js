const express = require('express')
const redisClient = require('./../redis-server')
const router = express.Router()
// const redis = require("redis")
async function setRedis(req, res, next) {
    await redisClient.hSet('key4', {
        'javascript': 'ReactJS',
        'css': 'TailwindCSS',
        'node': 'Express'
    });
    const value = await redisClient.hGetAll('key3');
    res.status(200).json({
        status: 'success',
        data: value
    })
}

router.route('/').get(setRedis)

module.exports = router