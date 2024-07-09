const redis = require('redis')

const client = redis.createClient({ url: 'redis://localhost:6379' })
client.on('connect', () => {
    console.log("Connected to Redis server")
})

module.exports = client