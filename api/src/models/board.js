const mongoose = require('mongoose')
const {postSchema} = require('./post')

const boardSchema = new mongoose.Schema({
  _id: String,
  title: String,
  posts: [postSchema],
})

const Board = mongoose.model('Board', boardSchema)

module.exports = {Board}
