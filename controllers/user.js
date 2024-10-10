const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { signUpSchema } = require('../helper/validation');
const {signUpSchemaLogin} = require('../helper/ValidationLogin');
const {signUpSchemaPassword} =  require('../helper/validatePassword');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const  sendOtpEmail = require('../helper/sendOtpEmail');
const  sendResetPassword = require('../helper/sendResetPass');
// const nodemailer = require('../helper/nodemailer');
const nodeSends = require('../helper/NodeMailer');


const secretKey = process.env.JWT_SECRET;


const signUp = async (req, res) => {
    try {
       const { error } = signUpSchema.validate(req.body);

       console.log(error);

       if (error) {
              return res.status(400).json({
                msg: error.details[0].message,
           })
       }

        const { name, email, password, number, address } = req.body;

        const userInfo = await User.findOne({ email: email })

        if (userInfo) {
            return res.status(400).json({
                msg: "Email already registered."
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name,
            email: email,
            address: address,
            number: number,
            password: hashPassword
        })

        const payload = { userId: user._id, purpose: 'register' };
        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        const subject = 'Account Has Been Created Successfully ☺️';
        const baseUrl = `http://localhost:3001/api/Emailverification/${token}`;

        const emailSent = await nodeSends(email, subject, name  , baseUrl);

        return res.status(200).json({
            msg: "Account created successfully",
            data: {
                user,
                token,
                emailSent
            }
        })

    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error, please try again",
        })
    }
}

const signIn = async (req, res) => {
    try {
        const { error } = signUpSchemaLogin.validate(req.body);
        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "This User Does Not Exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Email Or Password is incorrect' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ msg: 'Please verify your email before logging in.' });
        }

        const now = new Date();
        const otpExpirationPeriod = 2 * 24 * 60 * 60 * 1000;

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        let otpRequired = false;
        if (!user.otpLastVerified || (now - user.otpLastVerified) > otpExpirationPeriod) {
            otpRequired = true;
            
            const otp = generateOtp();
            user.otp = otp;
            user.otpExpires = new Date(now.getTime() + otpExpirationPeriod);

            await user.save();
            await sendOtpEmail(user.email, otp);

            return res.status(200).json({
                msg: 'OTP has been sent to your email. Please verify to proceed.',
                otpRequired: true, 
                token: token
            });
        }

        return res.status(200).json({
            msg: 'Login successful! No OTP required.',
            otpRequired: false,  
            token: token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'An error has been caught!' });
    }
};

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


const resetPassword  = async (req, res) => {
   try
   {
       const {email} = req.body;

       const user = await User.findOne({email});
       if (!user) {
           return res.status(400).json({msg:'User Does Not Exist'});
       }

       const payload  =  {userId: user._id, purpose: 'reset_password' };
       const Token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
       const baseUrl = `http://localhost:3000/auth/passwordChangePage/${Token}`;
       await  sendResetPassword(user.email, baseUrl);

       return  res.status(200).json({
           msg:'email of reset has been sent',

       })
   }catch (err)
   {
       console.log('there was an error sending the email');
       res.status(400).json({msg: 'internal error, please try again'});
   }

}



const changePassword = async (req, res) =>
{
    const token  = req.params.token;
    const {newPassword}  = req.body;
    console.log(token);
    // const { error } = signUpSchemaPassword.validate(req.body);

    if(!newPassword || !token) return res.status(400).json( {msg: 'please fill  Your password. or click  the  link  in your email' });

    // if (error) {
    //     return res.status(400).json({ msg: error.details[0].message });
    // }

    try{

        const decoded = jwt.verify(token, secretKey);

        if (decoded.purpose !== 'reset_password') {
            return res.status(400).json({ msg: 'Invalid token purpose. This token is not for password reset.' });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        // redirect('http://localhost:3000/auth/passwordChangePage');
        return res.status(200).json({ msg: 'Password has been successfully updated.' });

    }catch (err)
    {
        console.log('there  was an error', err);
        res.status(400).json({msg: 'internal error, please try again'});
    }


}




module.exports = {
    signUp,
    signIn,
    resetPassword,
    changePassword
}