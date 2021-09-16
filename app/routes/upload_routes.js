const express = require('express')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })
const Upload = require('../models/upload')
const router = express.Router()
const s3Upload = require('../../lib/s3_upload')

// compression may have to work around multer (before/after)
router.post('/uploads', upload.single('upload'), (req, res, next) => {
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
      return Upload.create({ url: awsFile.Location })
    })
  // { upload: { url: 'wwww.example.com' }}
    .then((uploadDoc) => {
      res.status(201).json({ uploadDoc })
    })
    .catch(next)
})

module.exports = router
