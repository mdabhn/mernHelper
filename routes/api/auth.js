const express = require('express')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')

const userAuth = require('../../middleware/user')

const userModel = require('../../models/User')
const router = express.Router()

router.get('/', userAuth, async (req, res) => {
  try {
    const userDetails = await userModel
      .findById(req.user.id)
      .select('-password')
    res.json(userDetails)
  } catch (error) {
    res.status(500).json({
      msg: 'bad database connection',
    })
  }
})

router.post(
  '/',
  [
    check('email', 'Please Enter an valid Email').isEmail(),
    check('password', 'Password must be 6 digit long').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const validationError = validationResult(req)

    if (!validationError.isEmpty()) {
      return res.status(400).json({
        errors: validationError.array(),
      })
    } else {
      const { email, password } = req.body

      const user = await userModel.findOne({ email })

      if (!user) {
        const errors = { msg: 'Wrong Credential' }
        return res.send(errors.msg)
      }

      if (user.password !== password) {
        const errors = { msg: 'Wrong Credentialx' }
        return res.send(errors.msg)
      }
      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(
        payload,
        config.get('JWS_SECRET'),
        {
          expiresIn: 36000,
        },
        (err, token) => {
          if (err) throw err
          res.send({ token })
        }
      )
    }
  }
)
module.exports = router
