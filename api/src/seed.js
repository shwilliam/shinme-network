const {Board, Post, Reply} = require('./models')

const seed = async () => {
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
}

module.exports = {seed}
