const nodemailer  = require('nodemailer');
require('dotenv').config();


const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.USER_PASS
    }
})

const nodeSends = async (Reciever, Subject, Body) => {
   try
   {
       const mailOptions = {
       from: process.env.EMAIL_USER,
       to: Reciever,
       subject: Subject,
       html: Body,
   };


   return await transport.sendMail(mailOptions);

   }catch (error)
   {
       console.log('there was an error in sending your email');
       throw  error;
   }



}

module.exports = nodeSends;




