const mongoose = require('mongoose')

const replySchema = new mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  comment: String,
  imageURL: String,
  createdAt: {type: Date, default: Date.now},
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

const boardSchema = new mongoose.Schema({
  _id: String,
  title: String,
  posts: [postSchema],
})

const Reply = mongoose.model('Reply', replySchema)
const Post = mongoose.model('Post', postSchema)
const Board = mongoose.model('Board', boardSchema)

module.exports = {Reply, Post, Board}
