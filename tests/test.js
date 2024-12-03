const request = require('supertest');
const app = require('../server'); // Adjust the path if necessary
const mongoose = require('mongoose');
const OTPModel = require('../models/otpmodel'); // Adjust the path if necessary

jest.mock('../controllers/authController.js', () => ({
  generateOTP: () => '123456', // Mock OTP generator to always return '123456'
}));

jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: jest.fn().mockResolvedValue('Email sent') // Mock sendMail function
  }),
}));

describe('Auth API', () => {
  // Close the database connection after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /login', () => {
    it('should send an OTP and return status 200', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'testuser@example.com' });

      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('OTP sent');

      // Check if the OTP was saved in the database
      const otpRecord = await OTPModel.findOne({ email: 'testuser@example.com' });
      expect(otpRecord).toBeTruthy();
      expect(otpRecord.otp).toBe('123456');
    });

    it('should return status 400 if no email is provided', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('Email is required');
    });
  });

  describe('POST /verify-otp', () => {
    beforeEach(async () => {
      // Insert a test OTP record into the database
      await OTPModel.create({ email: 'testuser@example.com', otp: '123456', createdAt: new Date() });
    });

    it('should verify OTP and return status 200', async () => {
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({ email: 'testuser@example.com', otp: '123456' });

      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('OTP verified');
    });

    it('should return status 400 if OTP is incorrect', async () => {
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({ email: 'testuser@example.com', otp: '654321' });

      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('Invalid OTP');
    });
  });
});
