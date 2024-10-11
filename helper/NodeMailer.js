const nodemailer  = require('nodemailer');
require('dotenv').config();


const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.USER_PASS
    }
})

const nodeSends = async (Reciever, Subject, name , verification_link) => {
   try
   {
       const mailOptions = {
       from: process.env.EMAIL_USER,
       to: Reciever,
       subject: Subject,
       html: `
       <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Account Verification</title>
            <style>
                /* Base styles */
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f2f2f2;
                    margin: 0;
                    padding: 0;
                }
        
                table {
                    max-width: 600px;
                    margin: 20px auto;
                    border-collapse: collapse;
                    background-color: #ffffff;
                    border: 1px solid #dddddd;
                    border-radius: 8px;
                }
        
                .header {
                    background-color: #2a2aec;
                    padding: 20px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                    color: white;
                    font-size: 24px;
                }
        
                .content {
                    padding: 20px;
                    text-align: left;
                    color: #333333;
                }
        
                .content p {
                    font-size: 16px;
                    line-height: 1.5;
                }
        
                .content a {
                    text-decoration: none;
                }
        
                .content .button {
                    display: block;
                    width: 200px;
                    margin: 20px auto;
                    text-align: center;
                    background-color:  #2a2aec;
                    padding: 15px;
                    border-radius: 5px;
                    font-size: 18px;
                    color: white;
                    cursor: pointer;
                }
        
                .content .button:hover {
                    background-color: #005d8b;
                }
        
                .footer {
                    background-color: #f7f7f7;
                    padding: 20px;
                    text-align: center;
                    font-size: 14px;
                    color: #888888;
                    border-radius: 0 0 8px 8px;
                }
        
                /* Responsive Styles */
                @media only screen and (max-width: 600px) {
                    table {
                        width: 100%;
                    }
        
                    .header {
                        font-size: 20px;
                    }
        
                    .content p {
                        font-size: 14px;
                    }
        
                    .content .button {
                        font-size: 16px;
                    }
                }
            </style>
        </head>
        
        <body>
            <table>
                <!-- Email Header -->
                <tr>
                    <td class="header">
                        Welcome to Our Delivery Service! 💫
                    </td>
                </tr>
        
                <!-- Email Content -->
                <tr>
                    <td class="content">
                        <p>Hello <strong>${name}</strong>, we are happy to have you here. Your account has been created successfully.</p>
                        <p>Please click the button below to verify your account:</p>
        
                        <!-- Verification Button -->
                        <a href="${verification_link}" class="button">
                            Verify My Account
                        </a>
        
                        <p>This link will expire in 1 hour, so make sure to verify your account ASAP. Enjoy!</p>
                    </td>
                </tr>
        
                <!-- Footer Section -->
                <tr>
                    <td class="footer">
                        If you did not create an account, you can safely ignore this email.
                        <br>
                        © 2024 Your Delivery Company, All rights reserved.
                    </td>
                </tr>
            </table>
        </body>
        
        </html>

       `,
   };


   return await transport.sendMail(mailOptions);

   }catch (error)
   {
       console.log('there was an error in sending your email');
       throw  error;
   }



}

module.exports = nodeSends;




