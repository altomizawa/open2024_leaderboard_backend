const jwt = require('jsonwebtoken')
require("dotenv").config();

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const secretKey = process.env.TOKEN_KEY;

  // CHECK IF THERE'S AN AUTHORIZATION (token)
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(404).send('no token or invalid token')
  }

  // AUTHORIZATION OK, REMOVE 'BEARER'
  const token = authorization.replace('Bearer ', '');

  let payload;

  // CHECK IF PAYLOAD IS MATCHES
  try {
    payload = jwt.verify(token, secretKey);
  } catch(err) {
    return res.status(400).send('access Forbidden')
  }

  // SET PAYLOAD TO REQ.USER
  req.user = payload;

  // CALL NEXT MIDDLEWARE
  next();
}