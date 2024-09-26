const  express = require('express');
const User = require('../models/user');




const VerifyIfUserIsValid = async (req, res) => {

   try
   {
       const UserById = req.user.userId;

       if (!UserById) return res.status(401).send('Token is required');

       const FindUser = await User.findById(UserById);
       if (!FindUser) return res.status(401).send('User not found');

       FindUser.isVerified = true;
       await FindUser.save();
       return res.status(200).json({ msg: 'Account successfully verified!' });

   }catch (err)
   {
       console.log(err);
       return res.status(401).json({msg:"Token Not Found"});
   }

}


module.exports = {
    VerifyIfUserIsValid
}