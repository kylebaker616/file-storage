require('dotenv').config()
const fs = require('fs')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const fileName = process.argv[2]
console.log(s3)

const readFilePromise = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

const uploadParams = {
  Bucket: 'kyle-capstone-bucket',
  Key: fileName
}

readFilePromise(fileName)
  .then(data => {
    uploadParams.Body = data
    return s3.upload(uploadParams).promise()
  })
  .then(console.log)
  .catch(console.error)
