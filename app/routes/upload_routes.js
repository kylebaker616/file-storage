const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
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
const s3Delete = require('../../lib/s3_delete')

// compression may have to work around multer (before/after)
router.post('/uploads', upload.single('upload'), requireToken, (req, res, next) => {
  // Set owner of the file to be the current user
  console.log(req.file)
  // compression function would need to go here
  // https://www.npmjs.com/package/compressing
  // const compressing = require('compressing');
  // compress(req.file) .then s3Upload
  // compress a file
  // compressing.gzip.compressFile('file/path/to/compress', 'path/to/destination.gz')
  // .then(compressDone)
  // .catch(handleError);
  // then s3Upload(compressedFile)
  s3Upload(req.file)
    .then((awsFile) => {
      console.log(awsFile)
      return Upload.create({ url: awsFile.Location, owner: req.user.id, mimetype: req.file.mimetype, key: awsFile.key })
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
router.delete('/uploads/:id', requireToken, (req, res, next) => {
  s3Delete(req)
  Upload.findById(req.params.id)
    .then(handle404)
    .then((upload) => {
      // throw an error if current user doesn't own `cart`
      requireOwnership(req, upload)
      // delete the cart ONLY IF the above didn't throw
      upload.deleteOne()
    })
  // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
  // if an error occurs, pass it to the handler
    .catch(next)
})
router.get('/frienduploads/:id', (req, res, next) => {
  Upload.find({ owner: req.params.id })
    .then((uploads) => {
      return uploads.map((upload) => upload.toObject())
    })
    .then((uploads) => res.status(200).json({ uploads: uploads }))
    .catch(next)
})
router.post('/pins', requireToken, (req, res, next) => {
  // set owner of new example to be current user
  req.body.upload.owner = req.user.id

  Upload.create(req.body.upload)
  // respond to succesful `create` with status 201 and JSON of new "example"
    .then((upload) => {
      res.status(201).json({ upload: upload.toObject() })
    })
  // if an error occurs, pass it off to our error handler
  // the error handler needs the error message and the `res` object so that it
  // can send an error message back to the client
    .catch(next)
})
module.exports = router
