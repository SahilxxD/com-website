const nodemailer = require('nodemailer');

// Looking to send emails in production? Check out our Email API/SMTP product!
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "61a599c6fdef59",
      pass: "513c79ea1f2d35"
    }
  });

module.exports = transporter;
