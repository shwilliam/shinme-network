import {useRef, useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {Nav, Post, Reply} from '../../../../components'
import {API_ENDPOINT} from '../../../../utils'

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

const PostPage = ({post, boards}) => {
  const [error, setError] = useState({})
  const imageUploadRef = useRef()
  const router = useRouter()
  const {id} = router.query

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
      setError({form: 'Reply must contain either an image or comment'})
      return
    }

    formData.set('path', JSON.stringify([post._id]))

    try {
      await fetch(`${API_ENDPOINT}/posts/${id}`, {
        method: 'POST',
        body: formData,
      })
      location.reload() // FIXME
    } catch (e) {} // FIXME
  }

  return (
    <div className="site__layout">
      <Nav className="site__nav" boards={boards} />

      <main className="site__main">
        <Link href="/board/[id]" as={`/board/${id}`}>
          <a>[ Back to {id} ]</a>
        </Link>

        <section>
          <header className="banner">{post.title || 'untitled'}</header>

          <Post
            name={post.name}
            comment={post.comment}
            createdAt={post.createdAt}
            imageURL={post.imageURL}
            boardID={id}
            postID={post._id}
            display
          />
        </section>

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
              <label className="form__label" htmlFor="post-image">
                Image:
              </label>
              <input
                ref={imageUploadRef}
                type="file"
                name="image"
                id="post-image"
              />
              <span className="form__input-error">{error?.image}</span>
            </div>

            <div className="form__input-container">
              <label className="form__label" htmlFor="post-comment">
                Comment:
              </label>
              <textarea
                name="comment"
                id="post-comment"
                className="form__input"
                rows="5"
              />
            </div>

            <div className="form__input-container -right">
              <span className="form__error">{error?.form}</span>
              <button type="submit">Publish</button>
            </div>
          </form>
        </section>

        <section>
          <h2>Replies</h2>

          <ul className="post__comments">
            {post.replies
              ?.sort(
                (replyA, replyB) =>
                  new Date(replyA.createdAt).getTime() <
                  new Date(replyB.createdAt).getTime(),
              )
              .map(
                ({_id, name, email, comment, imageURL, createdAt, replies}) => (
                  <li key={_id} className="post__comment">
                    <Reply
                      name={name}
                      comment={comment}
                      imageURL={imageURL}
                      createdAt={createdAt}
                      replies={replies}
                    />
                  </li>
                ),
              )}
          </ul>
        </section>
      </main>
    </div>
  )
}

export default PostPage
