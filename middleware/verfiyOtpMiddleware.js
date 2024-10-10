
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJwt = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const secretKey = process.env.JWT_SECRET;

    if (!token) {
        return res.status(403).json({ msg: 'No token provided, access denied.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return res.status(401).json({ msg: 'Invalid token, access denied.' });
    }
};

module.exports = verifyJwt;
