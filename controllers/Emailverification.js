const  express = require('express');
const User = require('../models/user');



const VerifyIfUserIsValid = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) return res.status(401).send('Token is required.');

        const FindUser = await User.findById(userId);
        if (!FindUser) return res.status(404).send('User not found.');

        if (FindUser.isVerified) {
            return res.status(400).json({ msg: 'User is already verified.' });
        }

        FindUser.isVerified = true;
        await FindUser.save();

        return res.status(200).json({ msg: 'Account successfully verified!' });

    } catch (err) {
        console.error('Verification error:', err);
        return res.status(500).json({ msg: 'Internal server error.' });
    }
}


module.exports = {
    VerifyIfUserIsValid
}