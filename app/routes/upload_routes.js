const express = require('express')
const Upload = require('../models/upload')
const router = express.Router()

router.post('/uploads', (req, res, next) => {
  // { upload: { url: 'wwww.example.com' }}
  Upload.create(req.body.upload)
    .then(upload => {
      res.status(201).json({ upload })
    })
    .catch(next)
})

module.exports = router
