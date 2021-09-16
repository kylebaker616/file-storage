const express = require('express')
const multer = require('multer')
const passport = require('passport')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const requireToken = passport.authenticate('bearer', { session: false })
const storage = multer.memoryStorage()
const upload = multer({ storage })
const Upload = require('../models/upload')
const router = express.Router()
const s3Upload = require('../../lib/s3_upload')

// compression may have to work around multer (before/after)
router.post('/uploads', upload.single('upload'), requireToken, (req, res, next) => {
  // Set owner of the file to be the current user
  console.log(req.file)
  // compression function would need to go here
  // https://www.npmjs.com/package/compressing
  // const compressing = require('compressing');

  // compress a file
  // compressing.gzip.compressFile('file/path/to/compress', 'path/to/destination.gz')
  // .then(compressDone)
  // .catch(handleError);
  // then s3Upload(compressedFile)
  s3Upload(req.file)
    .then((awsFile) => {
      console.log(awsFile)
      return Upload.create({ url: awsFile.Location, owner: req.user.id })
    })
  // { upload: { url: 'wwww.example.com' }}
    .then((uploadDoc) => {
      res.status(201).json({ uploadDoc })
    })
    .catch(next)
})

router.get('/uploads', requireToken, (req, res, next) => {
  Upload.find({ owner: req.user.id })
    .then((uploads) => {
      return uploads.map((upload) => upload.toObject())
    })
    .then((uploads) => res.status(200).json({ uploads: uploads }))
    .catch(next)
})

module.exports = router
