const express = require('express')
const {Board} = require('../models')

const boardsRouter = express.Router()

boardsRouter.get('/', async (_, res) => {
  try {
    const boards = await Board.find()
    res.send(boards)
  } catch (e) {
    res.status(422).send({error: 'Error fetching posts', detail: e.message})
  }
})

module.exports = {boardsRouter}
