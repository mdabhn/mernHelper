const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token')
  if (!token) {
    return res.status(400).json({
      msg: 'no token found, access denied',
    })
  }
  try {
    const decode = jwt.verify(token, config.get('JWS_SECRET'))
    req.user = decode.user
    next()
  } catch (error) {
    res.json({
      error,
    })
  }
}
