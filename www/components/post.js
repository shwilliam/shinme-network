import Link from 'next/link'
import {format} from '../utils'
import {Reply} from './index'

export const Post = ({
  name,
  title,
  comment,
  createdAt,
  imageURL,
  boardID,
  postID,
  replies,
  display = false,
}) => (
  <article className="post">
    <header className="post__header">
      <span className="post__name">{name || 'anon'}</span>
      {title && <span className="post__title">{title}</span>}
      <span className="post__date">{createdAt && format(createdAt)}</span>

      {!display && (
        <Link href="/board/[id]/[board]" as={`/board/${boardID}/${postID}`}>
          <a>[ Reply ]</a>
        </Link>
      )}
    </header>

    <p className="post__content">
      {imageURL && <img className="image post__image" src={imageURL} />}
      {comment}
    </p>

    {replies && (
      <ul className="board__replies">
        {replies.map(({_id, name, comment, imageURL, createdAt}) => (
          <li key={_id} className="board__reply">
            <Reply
              name={name}
              comment={comment}
              imageURL={imageURL}
              createdAt={createdAt}
            />
          </li>
        ))}
      </ul>
    )}
  </article>
)
