const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, name, message, address, subject } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email provider
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your app password or email password
        },
    });

    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.RECEIVER_EMAIL, // Your receiver email
        subject: `Message from ${name} regarding ${subject}`,
        html: `
    <p><strong>From:</strong> ${email}</p>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Address:</strong> ${address}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
    `,
        replyTo: email,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email.' });
    }
}
