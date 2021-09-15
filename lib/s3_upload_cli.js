require('dotenv').config()
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
console.log(s3)

const uploadParams = {
  Bucket: 'kyle-capstone-bucket',
  Key: 'filename.txt',
  Body: 'Hello World'
}

s3.upload(uploadParams, function (err, data) {
  console.log(err, data)
})
