const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendMail = async (otp, email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      user: process.env.EMAIL, // Requires modification
      pass: process.env.EMAIL_PASSWORD, // Requires modification
    },
  });
  var otpOptions = {
    from: process.env.EMAIL, // Requires modification
    to: email,
    subject: "Mihles.cart email verfication",
    text: `OTP : ${otp}`,
  };

  const info = await transporter.sendMail(otpOptions);
  return info;
};
