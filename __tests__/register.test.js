const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { signUp } = require('../controllers/user');

jest.mock('bcryptjs'); // Mock bcryptjs
jest.mock('../models/user'); // Mock the User model

describe('signUp function', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'Password123',
                number: '0697042868',
                address: 'ait ourir',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Clear mocks before each test
        bcrypt.hash.mockClear();
        User.create.mockClear();
    });

    it('should register a user and hash the password correctly', async () => {
        // Mock bcrypt.hash to resolve with a hashed password
        bcrypt.hash.mockResolvedValue('hashed_password');

        // Mock User.create to simulate the database user creation
        User.create.mockResolvedValue({
            _id: 'user_id',
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            number: req.body.number,
            password: 'hashed_password',
        });

        // Call the signUp function (the function you want to test)
        await signUp(req, res);

        // Verify that bcrypt.hash was called with the correct password and salt rounds
        expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);

        // Verify that User.create was called with the expected user data
        expect(User.create).toHaveBeenCalledWith({
            name: req.body.name,
            email: req.body.email,
            password: 'hashed_password', // The hashed password
            address: req.body.address,
            number: req.body.number,
        });

        // Verify the response status and JSON response sent by signUp
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Account created successfully',
            data: {
                user: expect.objectContaining({
                    _id: 'user_id',
                    name: req.body.name,
                    email: req.body.email,
                    address: req.body.address,
                    number: req.body.number,
                    password: 'hashed_password',
                }),
                token: expect.any(String), // Assuming a token is returned
                emailSent: expect.objectContaining({
                    accepted: expect.any(Array),
                    messageId: expect.any(String),
                    response: expect.any(String),
                }),
            },
        });
    });
});
