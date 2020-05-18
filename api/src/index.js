require('dotenv').config()
const express = require('express')
const {upload} = require('./services/image-upload')

const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('🌼')
})

app.post('/upload', (req, res) => {
  upload.single('image')(req, res, e => {
    if (e)
      res.status(422).send({error: 'Image upload error', detail: e.message})
    else res.json({imageURL: req.file.location})
  })
})

app.listen(PORT, () => {
  console.log(`listening on *:${PORT}`)
})
