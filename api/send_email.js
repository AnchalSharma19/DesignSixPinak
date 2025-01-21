const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, name, message, address, subject } = req.body;

    // Validate input fields
    if (!email || !name || !message || !address || !subject) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Set up the transporter with Gmail's SMTP
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Gmail SMTP server
        port: 465, // Secure port for SSL
        secure: true, // Use SSL
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your app-specific password
        },
    });

    // Mail options
    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.RECEIVER_EMAIL, // Receiver's email address
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
        // Verify SMTP connection
        await transporter.verify();
        console.log('SMTP server is ready to send emails.');

        // Send the email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            message: 'Failed to send email. Please try again later.',
            error: error.message,
        });
    }
}
