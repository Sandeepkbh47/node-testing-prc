const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Must provide name']
    },
    email: {
        type: String,
        required: [true, 'Must provide email field'],
        validate: [validator.isEmail, 'Not a valid email address'],
        unique: true
    },
    password: {
        type: String,
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        minlength: 8,
        validate: {
            validator: function (el) {
                return el == this.password
            },
            message: "Password doesn't match"
        }
    },
    active: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
})

userSchema.methods.isPasswordCorrect = (candidatePassword, userPassword) => {
    return bcrypt.compare(candidatePassword, userPassword)
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User