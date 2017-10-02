
const jwt = require('jsonwebtoken');
const Users = require('../repositories/UserRepository');
const properties = {
  protocol: "http",
  domain: "localhost",
  port: 8000,
  database: {
      name: process.env.DB || 'accounts',
      user: process.env.DB_USER || 'admin',
      pass: process.env.DB_PASS || 'admin',
      url: 'mongo'
  },

  // facebook
  facebook: {
      APP_ID: 2123391177888299,
      APP_SECRET: "7ba9062fb6cffa18fbe44a6cc15df413",
      CALLBACK_URL: 'http://localhost:8000/api/facebook/callback'
  },
  jwt: {
      secret: "Fawe46AFUu2eJEkgfzhBcBmYtuz9jJe7KTVPmWq&U]fskx/DUZLtDgHB^oxL7GzW"
  }
};

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