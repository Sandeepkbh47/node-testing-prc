const mongoose = require('mongoose')

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
    },
    price: {
        type: Number
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 4
    },
    averageRating: {
        type: Number,
        default: 4.5
    },
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    }
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour