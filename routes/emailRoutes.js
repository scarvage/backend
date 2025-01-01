const express = require('express');
const { sendFeedbackEmail, sendSupportEmail } = require('../controllers/emailController');
const router = express.Router();

router.post('/feedback', sendFeedbackEmail);
router.post('/support', sendSupportEmail);

module.exports = router;
