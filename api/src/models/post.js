const mongoose = require('mongoose')
const {replySchema} = require('./reply')

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

const Post = mongoose.model('Post', postSchema)

module.exports = {Post, postSchema}
