
const jwt = require('jsonwebtoken');
const Users = require('../repositories/UserRepository');
const properties = require('../config/properties');

module.exports = {
  isAuthenticated: isAuthenticated,
  generateAccessToken: generateAccessToken
};

async function isAuthenticated(req, res, next) {
  try {
    var decoded = jwt.verify(req.get('auth'), properties.jwt.secret);
  } catch (e) {
    return res.sendStatus(403);
  }
  try {
    req.user = await Users.getUserDetailsBySocialId(decoded.sub);
  } catch (e) {
    console.log('e', e);
  }
  return next();
}

function generateAccessToken(userId) {
  try {
    var token = jwt.sign({ sub: userId }, properties.jwt.secret, {
      expiresIn: '60 days'
    });
  } catch (e) {
    console.log('error', e);
  }
  return token;
}