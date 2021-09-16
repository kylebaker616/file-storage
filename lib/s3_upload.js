require('dotenv').config()
// aws-sdk 'software development kit' - similar to a library, built in methods.
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
    // for the key new Date must be added to create a unique value for every upload
    // this prevents prior issue of repeated uploads of identical files being ignored by s3 bucket.
    Key: +new Date() + '_' + file.originalname,
    Body: file.buffer,
    ACL: 'public-read',
    ContentType: file.mimetype
  }

  return s3.upload(uploadParams).promise()
}
