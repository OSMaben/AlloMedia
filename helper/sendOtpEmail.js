const nodemailer = require("nodemailer");



const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'OTP for Account Verification',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e2e2; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4CAF50; font-size: 24px;">Account Verification</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 10px; border: 1px solid #ddd;">
          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 16px; color: #333;">We are excited to have you on board! Please use the OTP below to verify your account:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; padding: 15px 30px; font-size: 24px; color: #fff; background-color: #4CAF50; border-radius: 5px; font-weight: bold; letter-spacing: 2px;">${otp}</span>
          </div>
          <p style="font-size: 16px; color: #333;">This OTP is valid for only 5 minutes. If you did not request this, please ignore this email or contact support.</p>
          <p style="font-size: 16px; color: #333;">Thanks,<br> The Delivery Team</p>
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
          <p>&copy; ${new Date().getFullYear()} Delivery Service. All rights reserved.</p>
          <p style="color: #999;">123 Delivery Road, Suite 456, City, Country</p>
        </div>
      </div>
    `,
    };

  return  await transporter.sendMail(mailOptions);
};


module.exports = sendOtpEmail;