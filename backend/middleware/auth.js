const jwt = require('jsonwebtoken');
const config = require('../config/default');

module.exports = function (req, res, next) {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(401).send('Access denied');

  try {
    const verified = jwt.verify(token, config.secretOrKey);
    req.user = verified;
    next();
  } catch {
    res.status(400).send('Invalid token');
  }
};
