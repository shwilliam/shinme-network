import {useRouter} from 'next/router'
import Nav from '../../../../components/nav'

export async function getServerSideProps(context) {
  const boards = await fetch(`${process.env.API_ENDPOINT}/boards`).then(res =>
    res.json(),
  )
  const post = await fetch(
    `${process.env.API_ENDPOINT}/posts/${context.params.id}/${context.params.post}`,
  ).then(res => res.json())

  return {
    props: {post, boards},
  }
}

const Post = ({post, boards}) => {
  const router = useRouter()
  const {id} = router.query

  const handleSubmit = async e => {
    e.preventDefault()

    const formData = new FormData(e.target)
    formData.set('path', JSON.stringify([post._id]))

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
        <h1>Post: {post.title || 'untitled'}</h1>
        {post.imageURL && <img src={post.imageURL} />}

        <section>
          <form onSubmit={handleSubmit} className="form">
            <div className="form__input-container">
              <label className="form__label" htmlFor="post-name">
                Name:
              </label>
              <input
                type="text"
                name="name"
                id="post-name"
                className="form__input"
              />
            </div>

            <div className="form__input-container">
              <label className="form__label" htmlFor="post-email">
                Email:
              </label>
              <input
                type="email"
                name="email"
                id="post-email"
                className="form__input"
              />
            </div>

            <div className="form__input-container">
              <label className="form__label" htmlFor="post-comment">
                Comment:
              </label>
              <input
                type="text"
                name="comment"
                id="post-comment"
                className="form__input"
              />
            </div>

            <div className="form__input-container">
              <label className="form__label" htmlFor="post-image">
                Image:
              </label>
              <input type="file" name="image" id="post-image" />
            </div>

            <div className="form__input-container">
              <button type="submit">Publish</button>
            </div>
          </form>
        </section>

        <section>
          <h2>Comments</h2>

          <ul className="post__comments">
            {post.replies.map(
              ({_id, name, email, comment, imageURL, createdAt, replies}) => (
                <li key={_id} className="post__comment">
                  <p>Name: {name}</p>
                  {imageURL && <img src={imageURL} />}
                  <p>{comment}</p>

                  {replies && (
                    <ul>
                      {replies.map(
                        ({_id, name, email, comment, imageURL, createdAt}) => (
                          <li key={_id}>
                            <p>Name: {name}</p>
                            {imageURL && <img src={imageURL} />}
                            <p>{comment}</p>
                          </li>
                        ),
                      )}
                    </ul>
                  )}
                </li>
              ),
            )}
          </ul>
        </section>
      </main>
    </div>
  )
}

export default Post
