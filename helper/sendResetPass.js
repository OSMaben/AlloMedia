const nodemailer = require("nodemailer");
require('dotenv').config();



const sendOtpEmail = async (email, link) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.USER_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Your Password',
        html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e2e2; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h1 style="color: #4CAF50; font-size: 24px;">Reset Your Passowrd</h1>
                </div>
                <div style="padding: 20px; background-color: #f9f9f9; border-radius: 10px; border: 1px solid #ddd;">
                  <p style="font-size: 16px; color: #333;">Hello,</p>
                  <p style="font-size: 16px; color: #333;">We understand that you  have problems with accessing your account thats why you  can use the link below  to change your  password:</p>
                  <div style="text-align: center; margin: 20px 0;">
                    <a href="${link}" style="display: inline-block; padding: 15px 30px; font-size: 24px; color: #fff; background-color: #4CAF50; border-radius: 5px; font-weight: bold; letter-spacing: 2px;">Change Password</a>
                  </div>
                  <p style="font-size: 16px; color: #333;">This Link is valid for only 5 minutes. If you did not request this, please ignore this email or contact support.</p>
                  <p style="font-size: 16px; color: #333;">Thanks,<br> The Delivery Team</p>
                </div>
                <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
                  <p>&copy; ${new Date().getFullYear()} Delivery Service. All rights reserved.</p>
                  <p style="color: #999;">123 Delivery Road, Suite 456, City, Country</p>
                </div>
              </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};


module.exports = sendOtpEmail;