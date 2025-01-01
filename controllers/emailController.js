const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendFeedbackEmail = async (req, res) => {
  const { feedback, emoji } = req.body;

  // Validate the rating
  if (typeof emoji !== 'number' || emoji < 1 || emoji > 5) {
    return res.status(400).json({ message: 'Invalid rating. Must be a number between 1 and 5.' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: 'mihirojha98@gmail.com',
    subject: 'App Feedback',
    text: `User Feedback: ${feedback}\nRating: ${emoji}/5`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Feedback email sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', error });
  }
};

exports.sendSupportEmail = async (req, res) => {
  const { message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: 'mihirojha98@gmail.com',
    subject: 'Support Request',
    text: `User Message: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Support email sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', error });
  }
};
