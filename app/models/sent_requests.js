const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sentRequestsSchema = new Schema(
  {
    recipient: String,
    requestId: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

module.exports = sentRequestsSchema
