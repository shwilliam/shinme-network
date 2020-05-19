import {useRouter} from 'next/router'
import Link from 'next/link'
import Nav from '../../../components/nav'

export async function getServerSideProps(context) {
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
  const router = useRouter()
  const {id} = router.query

  const handleSubmit = async e => {
    e.preventDefault()

    const formData = new FormData(e.target)

    try {
      await fetch(`http://localhost:3000/posts/${id}`, {
        method: 'POST',
        body: formData,
      })
    } catch (e) {} // FIXME

    location.reload() // FIXME
  }

  return (
    <div className="site__layout">
      <Nav className="site__nav" boards={boards} />

      <main className="site__main">
        <h1>Board: {id}</h1>

        <form onSubmit={handleSubmit} className="form">
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
            <label className="form__label" htmlFor="board-email">
              Email:
            </label>
            <input
              type="email"
              name="email"
              id="form__board-email"
              className="form__input"
            />
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
            <label className="form__label" htmlFor="form__board-comment">
              Comment:
            </label>
            <input
              type="text"
              name="comment"
              id="form__board-comment"
              className="form__input"
            />
          </div>

          <div className="form__input-container">
            <label className="form__label" htmlFor="form__board-image">
              Image:
            </label>
            <input
              type="file"
              name="image"
              id="form__board-image"
              className="form__input"
            />
          </div>

          <div className="form__input-container">
            <button type="submit">Publish</button>
          </div>
        </form>

        <ul className="board__posts">
          {posts.map(
            ({
              _id,
              name,
              email,
              title,
              comment,
              imageURL,
              createdAt,
              replies,
            }) => (
              <li key={_id} className="board__post">
                <Link href="/board/[id]/[board]" as={`/board/${id}/${_id}`}>
                  <a>
                    {title || 'untitled'} ({name || 'anon'})
                  </a>
                </Link>

                {createdAt && <p>{createdAt}</p>}
                {comment && <p>{comment}</p>}

                <div>
                  <img src={imageURL} />
                </div>

                {replies && (
                  <ul className="board__replies">
                    {replies.map(
                      ({_id, name, email, comment, imageURL, createdAt}) => (
                        <li key={_id} className="board__reply">
                          <p>
                            {title || 'untitled'} ({name || 'anon'})
                          </p>

                          {createdAt && <p>{createdAt}</p>}
                          {comment && <p>{comment}</p>}

                          <div>
                            <img src={imageURL} />
                          </div>
                        </li>
                      ),
                    )}
                  </ul>
                )}
              </li>
            ),
          )}
        </ul>
      </main>
    </div>
  )
}

export default Board
