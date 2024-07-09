const jwt = require('jsonwebtoken')
const User = require('./../models/userModel')
const AppError = require('./../utilities/appError')
const catchAsync = require('./../utilities/catchAsync')
const { promisify } = require('util')

const getJwtToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET_JWT_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createAndSendToken = (_id, statusCode, res) => {
    const token = getJwtToken(_id)
    res.cookie('jwt', token, {
        expiresIn: new Date(Date.now() + 2 * 60 * 60 * 1000),
        httpOnly: true
    })
    res.status(statusCode).json({
        status: 'success',
        token
    })
}

// eslint-disable-next-line no-unused-vars
exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passswordConfirm
    })
    req.app.get('socket').emit('message', "New User Signed Up")
    createAndSendToken(user._id, 201, res)
})


exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new AppError('Email or password not provided', 400))
    }
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        return next(new AppError('No email is registered with us. Please signup.', 400))
    }
    const is_pass_correct = await user.isPasswordCorrect(password, user.password)
    if (!is_pass_correct) {
        return next(new AppError('Email or password is incorrect', 400))
    }
    createAndSendToken(user._id, 200, res)
})

exports.protect = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_JWT_KEY)
    const currentUser = await User.findById(decoded._id)
    if (!currentUser) {
        return next(new AppError('Invalid token. Please login again'), 401)
    }
    req.user = currentUser
    next()
})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        console.log(req.user)
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You dont have permission to perform this opereation', 403))
        }
        next()
    }
}