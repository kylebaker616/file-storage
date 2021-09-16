require('dotenv').config()
// aws-sdk 'software development kit' - similar to a library, built in methods.
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

module.exports = (file) => {
  const deleteParams = {
    Bucket: 'kyle-capstone-bucket',
    Key: file.body.data

  }

  //   return s3.upload(uploadParams).promise()
  return s3.deleteObject(deleteParams, function (err, data) {
    if (err) console.log(err, err.stack)
    // error
    else console.log('deleted') // deleted
  })
}
