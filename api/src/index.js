const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

require('dotenv').config()

const {Post, Reply, Board} = require('./models')

const {boardsRouter, postsRouter} = require('./routes')

const PORT = process.env.PORT || 3000
const DB_URL = 'mongodb://mongo:27017/shinme'

// TODO: refactor
// TODO: validate body params
// TODO: validate url params

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

app.get('/', (_, res) => {
  res.send('🌼')
})

app.use('/boards', boardsRouter)
app.use('/posts', postsRouter)

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    await Promise.all([
      Post.deleteMany({}),
      Reply.deleteMany({}),
      Board.deleteMany({}),
    ])

    const boards = [
      'Plants',
      'Insects',
      'Animals',
      'Coffee',
      'Cooking',
      'Ramen',
      'Art',
      'Design',
      'Books',
      'Cameras',
      'Computers',
      'Keyboards',
      'Games',
      'Misc',
    ].map(
      title =>
        new Board({
          title,
          _id: title.toLowerCase(),
        }),
    )

    await Promise.all(boards.map(board => board.save()))

    app.listen(PORT, () => {
      console.log(`listening on *:${PORT}`)
    })
  })
