require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const twilio = require('twilio');

app.use(bodyParser.json());
const port = process.env.PORT

app.use(cors());

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
        console.log('error');
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

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = new twilio(accountSid, authToken);

app.post('/send-whatsapp', (req, res) => {
    const { to, message } = req.body; // to is the recipient phone number in WhatsApp format (e.g., "whatsapp:+919876543210")
    
    client.messages
      .create({
        body: message,
        from: 'whatsapp:+14155238886',
        to: to,
      })
      .then((message) => {
        console.log('success');
        res.status(200).send({ success: true, messageSid: message.sid });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send({ success: false, error: error.message });
      });
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});