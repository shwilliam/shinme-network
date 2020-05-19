require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const shortid = require('shortid')
const {Post, Reply, Board} = require('./models/post')
const {upload} = require('./services/image-upload')

const PORT = process.env.PORT || 3000
const DB_URL = 'mongodb://mongo:27017/shinme'

// TODO: refactor
// TODO: validate body params
// TODO: validate url params

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (_, res) => {
  res.send('🌼')
})

app.get('/boards', async (_, res) => {
  try {
    const boards = await Board.find()
    res.send(boards)
  } catch (e) {
    res.status(422).send({error: 'Error fetching posts', detail: e.message})
  }
})

app.get('/posts/:board', async (req, res) => {
  try {
    const board = await Board.findOne({_id: req.params.board})
    res.send(board.posts)
  } catch (e) {
    res.status(422).send({error: 'Error fetching posts', detail: e.message})
  }
})

app.get('/posts/:board/:id', async (req, res) => {
  try {
    const board = await Board.findOne({_id: req.params.board})
    const post = board.posts.find(({_id}) => _id === req.parms.id)
    res.send(post)
  } catch (e) {
    res.status(422).send({error: 'Error fetching post', detail: e.message})
  }
})

app.post('/posts/:board', upload.single('image'), async (req, res) => {
  try {
    const {name, email, title, comment, path} = req.body

    if (path) {
      const pathArr = JSON.parse(path)
      const reply = new Reply({
        _id: shortid.generate(),
        name,
        email,
        comment,
        imageURL: req.file && req.file.location,
      })

      if (pathArr.length === 1) {
        const board = await Board.findOne({_id: req.params.board})
        const post = board.posts.find(({_id}) => _id === pathArr[0])
        post.replies.push(reply)
        board.save()
      } else {
        // TODO: allow nested comments
        const post = await Post.findOne({_id: pathArr[0]})
        const parent = post.replies.find(reply => reply._id === pathArr[1])

        parent.replies.push(reply)
        post.save()
      }
      res.json(reply)
    } else {
      const post = new Post({
        _id: shortid.generate(),
        name,
        email,
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

app.listen(PORT, () => {
  console.log(`listening on *:${PORT}`)
})