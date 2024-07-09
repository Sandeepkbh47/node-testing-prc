const catchAsync = require('./../utilities/catchAsync')
const User = require('./../models/userModel')
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const user = await User.find()

    res.status(200).json({
        status: 'success',
        user
    })
})
exports.createUser = catchAsync(async (req, res, next) => {
    const user = await User.create(req.body)

    res.status(201).json({
        status: 'success',
        user
    })
})
exports.updateUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpadate(req.body._id, req.body, { new: true })

    res.status(200).json({
        status: 'success',
        user
    })
})
exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.body._id)

    res.status(204).json({
        status: 'success',
        user
    })
})