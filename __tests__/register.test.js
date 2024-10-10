const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { signUp } = require('../controllers/user');

jest.mock('bcryptjs');
jest.mock('../models/user');

describe('signUp function', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'Password123',
                number: '0697042868',
                address: "ait ourir"
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        bcrypt.hash.mockClear();
        User.create.mockClear();
    });

    it('should register a user and hash the password correctly', async () => {
        // Mock bcrypt.hash to return a specific value
        bcrypt.hash.mockResolvedValue('hashed_password');

        // Mock User.create to simulate the database operation
        User.create.mockResolvedValue({
            _id: 'user_id',
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            number: req.body.number,
            password: 'hashed_password',
        });

        await signUp(req, res); // Call the signUp function

        // Verify that bcrypt.hash was called with the correct arguments
        expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);

        // Verify that User.create was called with the expected values
        expect(User.create).toHaveBeenCalledWith({
            name: req.body.name,
            email: req.body.email,
            password: 'hashed_password',
            address: req.body.address,
            number: req.body.number,
        });

        // Verify the response status and JSON response
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Account created successfully',
            data: {
                user: expect.objectContaining({
                    _id: 'user_id',
                    name: 'John Doe',
                    email: 'john@example.com',
                    address: 'ait ourir',
                    number: '0697042868',
                    password: 'hashed_password',
                }),
                token: expect.any(String),
                // Match the emailSent object instead of a boolean
                emailSent: expect.objectContaining({
                    accepted: expect.any(Array),
                    messageId: expect.any(String),
                    response: expect.any(String),
                }),
            },
        });
    });
});
