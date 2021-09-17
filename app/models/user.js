const mongoose = require('mongoose')
const friendSchema = require('./friend')
const requestSchema = require('./request')
const sentRequestsSchema = require('./sent_requests')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  token: String,
  friends: [friendSchema],
  requests: [requestSchema],
  sentRequests: [sentRequestsSchema]
}, {
  timestamps: true,
  toObject: {
    // remove `hashedPassword` field when we call `.toObject`
    transform: (_doc, user) => {
      delete user.hashedPassword
      return user
    }
  }
})

module.exports = mongoose.model('User', userSchema)
