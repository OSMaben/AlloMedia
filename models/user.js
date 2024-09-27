const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        maxlenght: 50,
        trim: true
    },
    number: {
        type: String,
        maxlenght: 13,
        trim: true,
        default: null
    },
    email: {
        type: String,
        require: true,
        maxlenght: 13,
        trim: true
    },
    role: {
        type: Number,
        default: 0 // 1 => admin , 0 => customer
    },
    password: {
        type: String, // store the encrypted password
        require: true
    },
    address: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpires: { type: Date, default: null },
},
{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);