const mongoose = require('mongoose')

const uploadSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    mimetype: {
      type: String
    },
    key: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Upload', uploadSchema)
