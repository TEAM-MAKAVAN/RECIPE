
import jwt from "jsonwebtoken"
import User from "../models/user.js"
const { ApiError } = require('../utilities/ApiError.js');

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Authentication token is missing');
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid authentication token'));
  }
};

module.exports = authenticate;
