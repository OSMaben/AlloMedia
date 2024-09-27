const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require('crypto');
const sendOtpEmail = require('../helper/sendOtpEmail');
require('dotenv').config();

const IsLoginValid = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
        if (!token) return res.status(400).json({ msg: 'Token not found, try again' });

        const decoded = jwt.decode(token);
        if (!decoded) return res.status(401).json({ msg: 'Invalid token format, cannot decode' });

        const userId = decoded.userId;
        if (!userId) return res.status(401).json({ msg: 'Invalid token, cannot extract user ID' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        console.log("Secret used for JWT:", process.env.JWT_SECRET);

        try {
            jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        } catch (err) {
            return res.status(401).json({ msg: 'Token verification failed, please try again' });
        }

        if (!user.isVerified) {
            if (user.otp && user.otpExpires > new Date()) {
                return res.status(401).json({ msg: 'Account is not verified. Please enter the OTP sent to your email.' });
            }

            const otp = crypto.randomInt(100000, 999999).toString();
            user.otp = otp;
            user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
            await user.save();

            await sendOtpEmail(user.email, otp);
            return res.status(401).json({ msg: 'OTP sent to your email for verification. Please check your inbox.' });
        }

        // Check if the token has expired
        const tokenExpiresAt = new Date(decoded.exp * 1000);
        console.log(tokenExpiresAt);
        if (tokenExpiresAt < new Date()) {
            // Generate a new OTP and send it to the user if the token has expired
            const otp = crypto.randomInt(100000, 999999).toString();
            user.otp = otp;
            user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
            await user.save();

            await sendOtpEmail(user.email, otp);
            return res.status(401).json({ msg: 'Token has expired. OTP sent to your email for re-verification.' });
        }

        // Attach the user information to the request object
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Error validating login:', err);
        res.status(400).json({ msg: 'There was an error with the token, please try again' });
    }
};

module.exports = IsLoginValid;
