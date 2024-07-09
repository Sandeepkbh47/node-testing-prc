const catchAsync = require('./../utilities/catchAsync')
const Tour = require('./../models/tourModel')
const redisClient = require('./../redis-server')
const nodeCache = require('./../nc-store')
const extra = require('./../extra.json')


// eslint-disable-next-line no-unused-vars
exports.getAllTour = catchAsync(async (req, res, next) => {
    console.log(__dirname, __filename);
    let fromCache = true
    try {
        const tour = await redisClient.get("allTours")
        if (tour == null) {
            fromCache = false
            const tour = await Tour.find()
            await redisClient.set('allTours', JSON.stringify(tour), {
                EX: 10,
                NX: true
            })
            res.status(200).json({
                status: 'success',
                fromCache,
                extra,
                data: {
                    tour
                }
            })
        } else {
            res.status(200).json({
                status: 'success',
                fromCache,
                extra,
                data: {
                    tour: JSON.parse(tour)
                }
            })
        }
    } catch (error) {
        console.log(error)
        next(error)
    }

})

// eslint-disable-next-line no-unused-vars
exports.getTour = catchAsync(async (req, res, next) => {
    let fromCache = true
    let isHit = nodeCache.has(`tour-${req.body._id}`)
    let tour;
    if (isHit) {
        tour = JSON.parse(nodeCache.get(`tour-${req.body._id}`))
    }
    else {
        fromCache = false
        tour = await Tour.findById(req.body._id)
        nodeCache.set(`tour-${req.body._id}`, JSON.stringify(tour), 20)
    }
    res.status(200).json({
        status: 'success',
        fromCache,
        data: {
            tour
        }
    })
})

// eslint-disable-next-line no-unused-vars
exports.createTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.create(req.body)

    res.status(201).json({
        status: 'success',
        data: {
            tour
        }
    })
})

// eslint-disable-next-line no-unused-vars
exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.body._id, req.body, { new: true })

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
})

// eslint-disable-next-line no-unused-vars
exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.body._id)

    res.status(204).json({
        status: 'success',
        data: {
            tour
        }
    })
})