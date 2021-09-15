require('dotenv').config()
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

module.exports = (file) => {
  const uploadParams = {
    Bucket: 'kyle-capstone-bucket',
    //      [Object: null prototype] {} {
    //   fieldname: 'upload',
    //   originalname: 'cat.jpeg',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg',
    //   buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 84 00 0a 07 08 16 16 15 18 16 16 16 19 16 18 1a 18 19 18 1c 1c 1a 18 18 18 1a 18 ... 5784 more bytes>,
    //   size: 5834
    // }
    // for the key and body we are dotting onto the request object.
    Key: file.originalname,
    Body: file.buffer
  }

  return s3.upload(uploadParams).promise()
}
