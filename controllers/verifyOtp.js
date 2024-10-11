const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const verifyOtp = async (req, res) => {
    const { otp } = req.body;
    const secretKey = process.env.JWT_SECRET;

    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ msg: 'Authorization header missing. Please provide a valid token.' });
        }

        const token = authHeader.replace('Bearer ', '');

        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (!otp) {
            return res.status(400).json({ msg: 'OTP is required.' });
        }

        if (user.otp === otp && user.otpExpires > new Date()) {
            user.otpLastVerified = new Date();
            user.otp = null;  
            user.otpExpires = null;  

            await user.save();

            const payload = { userId: user._id };
            const newToken = jwt.sign(payload, secretKey, { expiresIn: '1d' });

            return res.status(200).json({ token: newToken, msg: 'OTP verified successfully. You are now logged in.' });
        } else if (user.otpExpires < new Date()) {
            const newOtp = generateOtp();
            user.otp = newOtp;
            user.otpExpires = new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days in milliseconds

            await user.save();
            await sendOtpEmail(user.email, newOtp);  

            return res.status(400).json({ msg: 'OTP has expired. A new OTP has been sent to your email.' });
        } else {
            return res.status(400).json({ msg: 'Invalid OTP. Please try again.' });
        }
    } catch (error) {
        console.error('OTP Verification Error:', error);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
};

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = verifyOtp;
