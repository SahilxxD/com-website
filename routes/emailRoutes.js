const express = require('express');
const sendEmail = require('../services/emailService');
const router = express.Router();

router.post('/send', async (req, res) => {
    const { to, name } = req.body;

    if (!to || !name) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        await sendEmail(to, "Welcome!", "../templates/welcome.html", { name });
        res.json({ message: 'Email sent successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending email', error });
    }
});

module.exports = router;