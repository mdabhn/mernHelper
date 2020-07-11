const express = require('express')
const userAuth = require('../../middleware/user')
const router = express.Router()

router.get('/', userAuth, (req, res) => {
  res.send('hello')
})

module.exports = router
