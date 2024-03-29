import {useRef, useState} from 'react'
import {useRouter} from 'next/router'
import FourOhFour from '../../404'
import {Nav, Post} from '../../../components'
import {API_ENDPOINT} from '../../../utils/'

export async function getServerSideProps(context) {
  // TODO: dry up requests
  const boards = await fetch(`${process.env.API_ENDPOINT}/boards`).then(res =>
    res.json(),
  )

  const posts = await fetch(
    `${process.env.API_ENDPOINT}/posts/${context.params.id}`,
  ).then(res => res.json())

  return {
    props: {posts, boards},
  }
}

const Board = ({posts, boards}) => {
  const [error, setError] = useState({})
  const imageUploadRef = useRef()
  const router = useRouter()
  const {id} = router.query

  // TODO: refactor form logic
  const handleSubmit = async e => {
    e.preventDefault()

    const imageUploadInput = imageUploadRef.current
    const imageUpload = imageUploadInput.files[0]
    if (imageUpload && imageUpload.size > (1024 * 1024) / 2) {
      setError({image: 'File too large'})
      return
    }

    const formData = new FormData(e.target)

    const comment = formData.get('comment')
    const image = formData.get('image')

    if (!comment && !image) {
      setError({form: 'Post must contain either an image or comment'})
      return
    }

    try {
      await fetch(`${API_ENDPOINT}/posts/${id}`, {
        method: 'POST',
        body: formData,
      })
      location.reload() // FIXME
    } catch (e) {} // FIXME
  }

  if (!Array.isArray(posts)) return <FourOhFour />

  return (
    <div className="site__layout">
      <Nav className="site__nav" boards={boards} />

      <main className="site__main">
        <h1 className="heading">{id}</h1>

        <form onSubmit={handleSubmit} className="form">
          <div className="form__input-container">
            <label className="form__label" htmlFor="form__board-image">
              Image:
            </label>
            <input
              ref={imageUploadRef}
              type="file"
              name="image"
              id="form__board-image"
              className="form__input"
            />
            <span className="form__input-error">{error?.image}</span>
          </div>

          <div className="form__input-container">
            <label className="form__label" htmlFor="form__board-title">
              Title:
            </label>
            <input
              type="text"
              name="title"
              id="form__board-title"
              className="form__input"
            />
          </div>

          <div className="form__input-container">
            <label className="form__label" htmlFor="board-name">
              Name:
            </label>
            <input
              type="text"
              name="name"
              id="form__board-name"
              className="form__input"
            />
          </div>

          <div className="form__input-container">
            <label className="form__label" htmlFor="form__board-comment">
              Comment:
            </label>
            <textarea
              name="comment"
              id="form__board-comment"
              className="form__input"
              rows="5"
            />
          </div>

          <div className="form__input-container -right">
            <span className="form__error">{error?.form}</span>
            <button className="form__submit" type="submit">
              Publish
            </button>
          </div>
        </form>

        <ul className="board__posts">
          {posts.map(
            ({_id, name, title, comment, imageURL, createdAt, replies}) => (
              <li key={_id} className="board__post">
                <Post
                  name={name}
                  title={title}
                  comment={comment}
                  imageURL={imageURL}
                  createdAt={createdAt}
                  replies={replies}
                  boardID={id}
                  postID={_id}
                />
              </li>
            ),
          )}
        </ul>
      </main>
    </div>
  )
}

export default Board
