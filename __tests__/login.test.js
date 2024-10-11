const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {signIn} = require('../controllers/user');
const sendOtpEmail  = require('../helper/sendOtpEmail'); 

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../models/user');
jest.mock('../helper/sendOtpEmail');

describe('signIn function', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                email: 'john@example.com',
                password: 'Password123'
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        bcrypt.compare.mockClear();
        User.findOne.mockClear();
        jwt.sign.mockClear();
        sendOtpEmail.mockClear();
    });


    it('should log in the user successfully without OTP required', async () => {
        // Mock User.findOne to return a user
        User.findOne.mockResolvedValue({
            _id: 'user_id',
            email: 'john@example.com',
            password: 'hashed_password',
            isVerified: true,
            otpLastVerified: new Date(),
        });

        // Mock bcrypt.compare to return true
        bcrypt.compare.mockResolvedValue(true);

        // Mock jwt.sign to return a token
        jwt.sign.mockReturnValue('test_token');

        await signIn(req, res); // Call the signIn function

        // Verify that User.findOne was called with the correct arguments
        expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });

        // Verify that bcrypt.compare was called with the correct arguments
        expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, 'hashed_password');

        // Verify that jwt.sign was called with the correct arguments
        expect(jwt.sign).toHaveBeenCalledWith({ userId: 'user_id' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Verify the response status and JSON response
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Login successful! No OTP required.',
            otpRequired: false,
            token: 'test_token',
        });
    });

    it('should prompt the user for OTP if OTP verification is required', async () => {
        // Mock user data with isVerified: false to trigger OTP
        const mockUser = {
            email: 'john@example.com',
            password: 'hashedPassword', // Assume the password is already hashed
            isVerified: false,
            otp: null,
            save: jest.fn().mockResolvedValue(true), // Mock save method
        };

        // Mock User.findOne to return the mock user
        User.findOne.mockResolvedValue(mockUser);

        // Mock sendOtpEmail
        sendOtpEmail.mockResolvedValue(true);

        // Mock request and response
        const req = {
            body: {
                email: 'john@example.com',
                password: 'password123',
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Call signIn function
        await signIn(req, res);

        // Check if sendOtpEmail was called with the correct arguments
        expect(sendOtpEmail).toHaveBeenCalledWith('john@example.com', expect.any(String));

        // Check if response status and JSON are correct
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'OTP sent. Please verify.' });
    });

    it('should return an error if the user does not exist', async () => {
        // Mock User.findOne to return null
        User.findOne.mockResolvedValue(null);

        await signIn(req, res); // Call the signIn function

        // Verify that User.findOne was called with the correct arguments
        expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });

        // Verify the response status and JSON response
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'This User Does Not Exist' });
    });

    it('should return an error if the password is incorrect', async () => {
        // Mock User.findOne to return a user
        User.findOne.mockResolvedValue({
            _id: 'user_id',
            email: 'john@example.com',
            password: 'hashed_password',
            isVerified: true,
        });

        // Mock bcrypt.compare to return false
        bcrypt.compare.mockResolvedValue(false);

        await signIn(req, res); // Call the signIn function

        // Verify that bcrypt.compare was called with the correct arguments
        expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, 'hashed_password');

        // Verify the response status and JSON response
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Email Or Password is incorrect' });
    });

    it('should return an error if the user is not verified', async () => {
        // Mock User.findOne to return an unverified user
        User.findOne.mockResolvedValue({
            _id: 'user_id',
            email: 'john@example.com',
            password: 'hashed_password',
            isVerified: false,
        });

        // Mock bcrypt.compare to return true
        bcrypt.compare.mockResolvedValue(true);

        await signIn(req, res); // Call the signIn function

        // Verify that bcrypt.compare was called with the correct arguments
        expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, 'hashed_password');

        // Verify the response status and JSON response
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Please verify your email before logging in.' });
    });

    it('should handle errors and return a 500 status', async () => {
        // Mock User.findOne to throw an error
        User.findOne.mockRejectedValue(new Error('Database error'));

        await signIn(req, res); // Call the signIn function

        // Verify the response status and JSON response
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ msg: 'An error has been caught!' });
    });
});
