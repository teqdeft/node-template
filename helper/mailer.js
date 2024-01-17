import nodemailer from 'nodemailer';

// Create a transporter with SMTP configuration
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST, // SMTP server
    port: process.env.MAIL_PORT, // SMTP port
    secure: true, // Set to true if using SSL/TLS
    auth: {
        user: process.env.MAIL_USERNAME, //  email address
        pass: process.env.MAIL_PASSWORD // email password or app-specific password
    }
});

export default {
    async send(mailOptions) {
        // Send email
        try {
            let info = await transporter.sendMail(mailOptions);
            return info;
        }
        catch (error) {
            console.error('Error:', error);
            return error
        };
    },
    async sendForgotPasswordMail(to, otp) {
        // Email content
        const mailOptions = {
            from: process.env.MAIL_FROM_ADDRESS,
            to: to,
            subject: 'Forgot Password',
            text: "Forgot Password? Don't worry we are here to help you. Your Otp to reset your password is : " + otp + ". Your Otp will Expire In 5 mins"
        };

        let res = await this.send(mailOptions);
        return res;
    }
}




