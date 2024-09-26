const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sendOtpEmail = require('../helper/sendOtpEmail');


const IsLoginValid = async (req, res, next) => {
    try {
        const Token = req.headers.authorization;
        console.log('This is the Auth Token', Token);

        if (!Token) {
            console.log('The token is not valid');
            return res.status(400).json({ msg: 'There was an error with the token, please try again.' });
        }

        const IsTokenValid = jwt.verify(Token, process.env.JWT_SECRET, { ignoreExpiration: true });
        const encoded = jwt.decode(Token);
        const ExtractTime = new Date(encoded.exp * 1000); // Convert expiration time from seconds to ms

        if (IsTokenValid && ExtractTime < new Date()) {

            const user = await User.findById(encoded.userId);
            if (user) {
                await sendOtpEmail(user.email);
                return res.status(401).json({
                    msg: 'Your token has expired. An OTP has been sent to your registered email for verification.',
                });
            } else {
                return res.status(404).json({ msg: 'User not found for this token.' });
            }
        }

        if (IsTokenValid) {
            req.user = encoded;
            next();
        } else {
            return res.status(401).json({ msg: 'Token is invalid.' });
        }
    } catch (err) {
        console.log('There was an error ', err);
        res.status(400).json({ msg: 'There was an error with the token validation process.', error: err });
    }
};

module.exports = IsLoginValid;
