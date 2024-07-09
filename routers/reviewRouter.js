const express = require('express')
const reviewController = require('./../controllers/reviewController')
const authController = require('./../controllers/authController')
const router = express.Router()



// .get(reviewController.getReview)

router.use(authController.protect, authController.restrictTo('user'))

router.route('/')
    .post(reviewController.createReview)
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview)

router.route('/byTour').get(reviewController.getReviewByTour)

module.exports = router