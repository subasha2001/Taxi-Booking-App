require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbConnect = require('./config/dbconfig');
const app = express();
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const Otp = require('./models/otpModel')
dbConnect();

app.use(bodyParser.json());
const port = process.env.PORT

app.use(cors());

const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

let otps = {};
app.post('/send-otp', async (req, res) => {
    const { mobile } = req.body;

    if (!mobile) {
        return res.status(400).json({ error: 'Mobile number is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    // const expiresAt = Date.now() + 5 * 60 * 1000;
    otps[mobile] = otp;

    await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:+91${mobile}`
    }).then(() => res.status(200).json('OTP sent successfully'))
    .catch((err) => res.status(500).send(err.message));
});

app.post('/verify-otp', (req, res) => {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) return res.status(400).json('Phone number and OTP are required.');

    if (otps[mobile] && otps[mobile] === parseInt(otp)) {
        delete otps[mobile];
        return res.status(200).json('OTP verified successfully.');
    }

    return res.status(400).json('Invalid OTP.');
});

app.post('/autocomplete', async (req, res) => {
    const query = req.body.query;
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
            params: {
                input: query,
                key: process.env.GAPI
            }
        });
        res.json(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Error fetching autocomplete suggestions' });
    }
});

app.post('/distance', async (req, res) => {
    const { origin, destination } = req.body;
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${process.env.GAPI}`);
        const distance = response.data.rows[0].elements[0].distance.value;
        res.json({ distance });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/send-whatsapp', (req, res) => {
    const { to, message } = req.body; // to is the recipient phone number in WhatsApp format (e.g., "whatsapp:+919876543210")

    const jsonString = message.split('Estimate Request: ')[1];
    const requestData = JSON.parse(jsonString);

    const body = `Estimate Request:
    Full Name: ${requestData.fullname}
    Mobile: ${requestData.mobile}
    Pickup: ${requestData.pickup}
    Drop: ${requestData.drop}
    Email: ${requestData.email}
    Booking Date: ${requestData.date}
    Booking Time: ${requestData.time}
    No Of Days: ${requestData.days || 'One Way'}
    Cab Type: ${requestData.cabType}`.trim()

    client.messages
        .create({
            body: body,
            from: process.env.TWILIO_PHONE,
            to: to,
        })
        .then((message) => {
            res.status(200).send({ success: true, messageSid: message.body });
        })
        .catch((error) => {
            res.status(500).send({ success: false, error: error.message });
        });
});

app.post('/send-admin', async (req, res) => {
    const { message } = req.body;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'subashayyanar1@gmail.com',
        text: message
    };
    try {
        await transporter.sendMail(mailOptions);

        const response = await axios.post(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
            {
                chat_id: process.env.CHAT_ID,
                text: message,
            }
        );
        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

app.post('/send-user', async (req, res) => {
    const { message, to } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to:to,
        text: message
    };
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send email', error });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});