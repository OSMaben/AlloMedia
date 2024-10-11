const User = require('../models/user');
const jwt = require("jsonwebtoken");

const VerifyIfUserIsValid = async (req, res) => {
    try {
        const userId = req.params.token;
        const decode = jwt.decode(userId, process.env.SECRET);
        if (!userId) return res.status(401).send('Token is required.');
        console.log(decode)
        const FindUser = await User.findById(decode.userId);
        if (!FindUser) return res.status(404).send('User not found.');

        if (FindUser.isVerified) {
            res.redirect('http://localhost:3000/auth/email-confirmation-success');
        }

        FindUser.isVerified = true;
        await FindUser.save();

         res.redirect('http://localhost:3000/auth/email-confirmation-success');

    } catch (err) {
        console.error('Verification error:', err);
        return res.status(500).json({ msg: 'Internal server error.' });
    }
}


module.exports = {
    VerifyIfUserIsValid
}