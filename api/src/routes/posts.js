const express = require('express')
const shortid = require('shortid')
const {upload} = require('../services')
const {Board, Post, Reply} = require('../models')

const postsRouter = express.Router()

postsRouter.get('/:board', async (req, res) => {
  try {
    const board = await Board.findOne({_id: req.params.board})
    res.send(board.posts.reverse())
  } catch (e) {
    res.status(422).send({error: 'Error fetching posts', detail: e.message})
  }
})

postsRouter.get('/:board/:id', async (req, res) => {
  try {
    const board = await Board.findOne({_id: req.params.board})
    const post = board.posts.find(({_id}) => _id === req.params.id)
    res.send(post)
  } catch (e) {
    res.status(422).send({error: 'Error fetching post', detail: e.message})
  }
})

postsRouter.post('/:board', upload.single('image'), async (req, res) => {
  try {
    const {name, title, comment, path} = req.body

    if (!comment && !req.file)
      throw new Error('Must provide either an image or comment')

    if (path) {
      const pathArr = JSON.parse(path)
      const board = await Board.findOne({_id: req.params.board})
      const reply = new Reply({
        _id: shortid.generate(),
        name,
        comment,
        imageURL: req.file && req.file.location,
      })

      if (pathArr.length === 1) {
        const post = board.posts.find(({_id}) => _id === pathArr[0])
        post.replies.push(reply)
        board.save()
      } else {
        // TODO: allow nested comments
        const post = board.posts.findOne({_id: pathArr[0]})
        const parent = post.replies.find(reply => reply._id === pathArr[1])

        parent.replies.push(reply)
        post.save()
      }
      res.json(reply)
    } else {
      const post = new Post({
        _id: shortid.generate(),
        name,
        title,
        comment,
        imageURL: req.file && req.file.location,
      })

      await Board.findOneAndUpdate(
        {_id: req.params.board},
        {$push: {posts: post}},
      )
      res.json(post)
    }
  } catch (e) {
    res.status(422).send({error: 'Error adding new post', detail: e.message})
  }
})

module.exports = {postsRouter}
