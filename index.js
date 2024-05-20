const express = require('express');
const dotenv = require('dotenv');
const SendGridApi = require('./services/sendGridApi.js');

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());

const sendGridApi = new SendGridApi({
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_SENDER: process.env.SENDGRID_SENDER,
    SENDGRID_SENDER_NAME: process.env.SENDGRID_SENDER_NAME
});

app.post('/send-email', async (req, res) => {
    const { subject, receiverData, templateData, attachments } = req.body;
    try {
        const response = await sendGridApi.sendEmail(subject, receiverData, templateData, attachments);
        if (response.ok) {
            res.status(200).send('Email sent successfully');
        } else {
            res.status(response.status).send('Failed to send email');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
