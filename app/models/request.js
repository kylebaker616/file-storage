const mongoose = require('mongoose')
const Schema = mongoose.Schema

const requestSchema = new Schema(
  {
    recipient: String,
    sender: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

module.exports = requestSchema
