const jwt = require("jsonwebtoken");
const User = require('../models/user');
require('dotenv').config();

const checkAuth = async function (req, res, next) {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      const unauthorizedError = new Error("Unauthorized");
      unauthorizedError.status = 401;
      //console.log("auth mid");
      return next(unauthorizedError);
    }
    
    const token = authHeader.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Access denied' });
    
    try {
        const { userId } = jwt.verify(token, `${process.env.JWT_SECRET}`);
  
        const user = await User.findById(userId);

        if (user) {
          req.user = user;
          next();
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = checkAuth;
