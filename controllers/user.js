const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Invalid inputs passed, please check your data.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(422).json({ error: 'User already exists, please login' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password:hashedPassword });
        await newUser.save();
        
        console.log(newUser);

        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
          );

        res.status(201).json({ message: 'User created successfully', user: newUser, token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error : 'Internal server error' });
        
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {

        if (!email || !password) {
            return res.status(400).json({ error: 'Invalid inputs passed, please check your data.' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error : 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        res.status(200).json({ message: 'User logged in successfully', user: user, token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
};



module.exports = { register, login };
