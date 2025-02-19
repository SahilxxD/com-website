const transporter = require('../config/emailConfig');
const fs = require('fs');
const path = require('path'); // ✅ Import the path module
const ejs = require('ejs');  // ✅ Import EJS

const sendEmail = async (to, sub, templatePath, data) => {
    try {
        const template = await ejs.renderFile(path.join(__dirname, `../views/${templatePath}`), data);

      

        const mailOptions = {
            from: '"E-Commerce Store" <no-reply@ecom.com>',
            to,
            sub,
            html: template
        }

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
    }catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;