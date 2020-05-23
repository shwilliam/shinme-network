const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

require('dotenv').config()

const {boardsRouter, postsRouter} = require('./routes')
const {seed} = require('./seed')

const PORT = process.env.PORT || 3000
const DB_URL = 'mongodb://mongo:27017/shinme'

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
    seed()

    app.listen(PORT, () => {
      console.log(`listening on *:${PORT}`)
    })
  })
