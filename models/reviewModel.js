const mongoose = require('mongoose')


const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        max: 200,
        required: [true, 'Must contain text as review']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour'
    }
})

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "name"
    })
    next()
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review