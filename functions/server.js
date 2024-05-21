const express = require('express');
const serverless = require('serverless-http');
const SendGridApi = require('./sendGridApi');

const app = express();
app.use(express.json());

const config = {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_SENDER: process.env.SENDGRID_SENDER,
    SENDGRID_SENDER_NAME: process.env.SENDGRID_SENDER_NAME
};

const sendGridApi = new SendGridApi(config);

app.post('/send-email', async (req, res) => {
    const { subject, receiverData, templateData, attachments } = req.body;
    try {
        const response = await sendGridApi.sendEmail(subject, receiverData, templateData, attachments);
        if (response.ok) {
            res.status(200).json({ message: 'Email sent successfully' });
        } else {
            res.status(response.status).json({ message: 'Failed to send email', error: response.statusText });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error sending email', error: error.message });
    }
});

app.get('/', async(req,res) => {
    res.status(200).json({ message: 'Server running' });
})

module.exports.handler = serverless(app);
