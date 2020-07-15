const express = require('express')
const router = express.Router()
const auth = require('../../middleware/user')
const profileModel = require('../../models/Profile')
const { check, validationResult } = require('express-validator')

/** @get my profile */
router.get('/me', auth, async (req, res) => {
  const profile = await profileModel
    .findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])

  if (!profile) {
    return res.status(500).json({ msg: 'No profile found' })
  }

  res.json(profile)
})

/** @update profile */

router.post(
  '/',
  [
    auth,
    [
      check('status', 'status is required').not().isEmpty(),
      check('skills', 'skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array(),
      })
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      linkedin,
      instagram,
    } = req.body

    const porfileFields = {}

    porfileFields.user = req.user.id

    if (company) porfileFields.company = company
    if (website) porfileFields.website = website
    if (location) porfileFields.location = location
    if (bio) porfileFields.bio = bio
    if (status) porfileFields.status = status
    if (githubusername) porfileFields.githubusername = githubusername
    if (skills) {
      porfileFields.skills = skills.split([',']).map(skill => skill.trim())
    }

    porfileFields.social = {}
    if (youtube) porfileFields.social.youtube = youtube
    if (twitter) porfileFields.social.twitter = twitter
    if (facebook) porfileFields.social.facebook = facebook
    if (linkedin) porfileFields.social.linkedin = linkedin
    if (instagram) porfileFields.social.instagram = instagram

    try {
      const profile = await profileModel.findOne({ user: req.user.id })
      if (profile) {
        await profileModel.findOneAndUpdate(
          { user: req.user.id },
          { $set: porfileFields },
          { new: true }
        )
        return res.send('profile updated')
      }
      const newProfileCreate = new profileModel(porfileFields)
      await newProfileCreate.save()

      return res.send(newProfileCreate)
    } catch (error) {
      res.send(error)
    }
  }
)

/** @get all profile */

router.get('/', (req, res) => {
  try {
    const profiles = profileModel
      .find()
      .populate('user', ['name', 'avatar'])
      .exec()
      .then(data => {
        res.send(data)
      })
  } catch (error) {
    res.send(error.msg)
  }
})

module.exports = router
