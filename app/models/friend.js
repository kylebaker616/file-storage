const mongoose = require('mongoose')

const Schema = mongoose.Schema

const friendSchema = new Schema(
  {
    potentialFriend: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

module.exports = friendSchema
