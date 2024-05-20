const fetch = require('node-fetch');

class SendGridApi {
    constructor(config) {
        this.config = config;
    }

    async sendEmail(subject, receiverData, templateData, attachments) {
        try {
            const { template_id, ...dynamic_template_data } = templateData || {};
            const options = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.config.SENDGRID_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    template_id,
                    subject,
                    personalizations: [
                        {
                            subject,
                            to: [receiverData],
                            dynamic_template_data,
                        }
                    ],
                    ...(attachments ? { attachments } : {}),
                    from: {
                        email: this.config.SENDGRID_SENDER,
                        name: this.config.SENDGRID_SENDER_NAME
                    },
                    reply_to: {
                        email: this.config.SENDGRID_SENDER,
                        name: this.config.SENDGRID_SENDER_NAME
                    }
                })
            };

            const baseUrl = 'https://api.sendgrid.com/v3/mail/send';
            const response = await fetch(baseUrl, options);
            return response;
        } catch (e) {
            console.error("Error while sending email:", e);
        }
    }
}

module.exports = SendGridApi;
