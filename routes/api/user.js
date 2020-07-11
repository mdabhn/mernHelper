const express = require('express')
const { check, validationResult } = require('express-validator')
var gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const userModel = require('../../models/User')
const config = require('config')

const router = express.Router()

router.post(
  '/',
  [
    check('name', 'name is required').not().isEmpty(),
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
      const { name, email, password } = req.body

      const userCheck = await userModel.findOne({ email })

      if (userCheck) {
        const errors = { msg: 'This email already existed ' }
        return res.send(errors.msg)
      }

      var avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      })

      const newUser = new userModel({
        name,
        email,
        password,
        avatar,
      })
      await newUser.save()

      const payload = {
        user: {
          id: newUser.id,
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
