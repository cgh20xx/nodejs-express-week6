const jwt = require('jsonwebtoken');
const handleErrorAsync = require('./handleErrorAsync');

const isAuth = handleErrorAsync(async (req, res, next) => {});

const generateJWT = (id) => {
  // 產生 JWT
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
};

module.exports = {
  isAuth,
  generateJWT,
};
