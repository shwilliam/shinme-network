const mongoose = require('mongoose')

const replySchema = new mongoose.Schema({
  _id: String,
  name: String,
  comment: String,
  imageURL: String,
  createdAt: {type: Date, default: Date.now},
})

const Reply = mongoose.model('Reply', replySchema)

module.exports = {Reply, replySchema}
