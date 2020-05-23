const mongoose = require('mongoose')
const {postSchema} = require('./post')

const boardSchema = new mongoose.Schema({
  _id: {type: String, required: true},
  title: {type: String, required: true},
  posts: [postSchema],
})

const Board = mongoose.model('Board', boardSchema)

module.exports = {Board}
