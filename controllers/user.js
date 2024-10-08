const bcrypt = require('bcrypt');
const User = require('../models/user');
const { signUpSchema } = require('../helper/validation');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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
        const { name, email, password,address,number } = req.body;

        const userInfo = await User.findOne({ email: email })

        if (userInfo) {
            return res.status(400).json({
                msg: "Email already registered."
            })
        }

        const hashPassword = await bcrypt.hashSync(password, 10);

        const user = await User.create({
            name: name,
            email: email,
            address: address,
            number: number,
            password: hashPassword
        })

        return res.status(200).json({
            msg: "Account created successfully",
            data: {
                user,
            }
        })

    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error, please try again",

        })
    }
}

const signIn = async (req, res) =>{
    try
    {
        const {error} = signUpSchema.validate(req.body);

        if(error)
        {
            return res.status(400).json({
                msg:error.details[0].message
            })
        }
        const {email , password} = req.body;

        const user =await User.findOne({email: email})

        if(!user)  return res.status(400).json({
            msg: "This User Does Not Exist"
        })


        const  isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)  return res.status(400).json({
            msg: 'You Have an error in your password'
        })

        const payload = { userId: user._id };
        console.log('payload is => ', payload);
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        res.status(200).json({
            token
        })

    }catch (error)
    {
        console.log(error);
        return res.status(500).json({
            msg: 'an error has been catched !!'
        })
    }

}

module.exports = {
    signUp,
    signIn
}