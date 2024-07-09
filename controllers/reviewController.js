const Review = require('./../models/reviewModel')
const catchAsync = require('./../utilities/catchAsync')
const AppError = require('./../utilities/appError')

// eslint-disable-next-line no-unused-vars
exports.createReview = catchAsync(async (req, res, next) => {
    req.body.user = req.user._id
    const review = await Review.create(req.body)

    res.status(201).json({
        status: 'success',
        review
    })
})

// eslint-disable-next-line no-unused-vars
exports.getReview = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.body._id)

    res.status(200).json({
        status: 'success',
        review
    })
})

// eslint-disable-next-line no-unused-vars
exports.updateReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndUpdate(req.body._id, req.body)

    res.status(200).json({
        status: 'success',
        review
    })
})

exports.deleteReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndDelete(req.body._id)
    if (!review) {
        return next(new AppError('No review exists', 404))
    }
    res.status(204).json({
        status: 'success',
        review
    })
})

// eslint-disable-next-line no-unused-vars
exports.getReviewByTour = catchAsync(async (req, res, next) => {
    const tour = req.body._id
    const review = await Review.find({ tour }).select('review user')

    res.status(200).json({
        status: 'success',
        review
    })
})