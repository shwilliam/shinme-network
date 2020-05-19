const mongoose = require('mongoose')

const replySchema = new mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  comment: String,
  imageURL: String,
  createdAt: {type: Date, default: Date.now},
  replies: [this],
})

const postSchema = new mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  title: String,
  comment: String,
  imageURL: String,
  createdAt: {type: Date, default: Date.now},
  replies: [replySchema],
})

const Reply = mongoose.model('Reply', replySchema)

const Post = mongoose.model('Post', postSchema)

module.exports = {Reply, Post}
