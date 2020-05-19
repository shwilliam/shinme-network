require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const shortid = require('shortid')
const {Post, Reply} = require('./models/post')
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

app.get('/posts', (_, res) => {
  Post.find((e, posts) => {
    if (e)
      res.status(422).send({error: 'Error fetching posts', detail: e.message})
    else {
      res.send(posts)
    }
  })
})

app.get('/posts/:id', (req, res) => {
  Post.findOne({_id: req.params.id}, (e, post) => {
    if (e)
      res.status(422).send({error: 'Error fetching post', detail: e.message})
    else {
      res.send(post)
    }
  })
})

app.post('/posts', upload.single('image'), async (req, res) => {
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
        await Post.findOneAndUpdate(
          {_id: pathArr[0]},
          {$push: {replies: reply}},
        )
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

      post.save((e, post) => {
        if (e)
          res
            .status(422)
            .send({error: 'Error saving to database', detail: e.message})
        else {
          res.json(post)
        }
      })
    }
  } catch (e) {
    res.status(422).send({error: 'Error adding new post', detail: e.message})
  }
})

app.listen(PORT, () => {
  console.log(`listening on *:${PORT}`)
})
