const express = require('express');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();

const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.post('/api/referrals', async (req, res) => {
  const { referrerName, referrerEmail, refereeName, refereeEmail } = req.body;

  try {
    const referral = await prisma.referral.create({
      data: {
        referrerName,
        referrerEmail,
        refereeName,
        refereeEmail,
      },
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'harshdh55@gmail.com',
        pass: 'T@tiy@bich00',
      },
    });

    const mailOptions = {
      from: 'harshdh55@gmail.com',
      to: refereeEmail,
      subject: 'You have been referred!',
      text: `Hi ${refereeName},\n\n${referrerName} has referred you to our platform. Check it out!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Error sending email' });
      }
      res.status(200).json({ message: 'Referral created and email sent' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating referral' });
  }
});

app.listen(port, ()=>{
  console.log(`Serrver is listning on port ${port}`)
})
module.exports = app;
