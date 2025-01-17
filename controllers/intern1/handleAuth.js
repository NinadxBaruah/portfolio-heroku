const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../db/UserModel2');
const auth = require('../../middleware/auth');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check existing user
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Generate token
        const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, { expiresIn: '24h' });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, { expiresIn: '24h' });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Store reset codes temporarily (use Redis or database for production)
const resetCodes = new Map();

// Step 1: Request password reset code
router.post('/reset-password/request', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetCode = crypto.randomInt(100000, 999999).toString();
        resetCodes.set(email, { code: resetCode, expires: Date.now() + 3600000 }); // Code valid for 1 hour

        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset Code',
            text: `Your password reset code is: ${resetCode}. It is valid for 1 hour.`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: 'Reset code sent to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Step 2: Reset password using code
router.post('/reset-password', async (req, res) => {
    const { email, code, newPassword } = req.body;

    const resetData = resetCodes.get(email);
    if (!resetData || resetData.code !== code || resetData.expires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        resetCodes.delete(email); // Remove code after successful reset
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;