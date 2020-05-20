import Link from 'next/link'
import Reply from './reply'
import {format} from '../utils/format-timestamp'

const Post = ({
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
  <div className="post">
    <p className="post__header">
      <span className="post__name">{name || 'anon'}</span>
      {title && <span className="post__title">{title}</span>}
      <span className="post__date">{createdAt && format(createdAt)}</span>

      {!display && (
        <Link href="/board/[id]/[board]" as={`/board/${boardID}/${postID}`}>
          <a>[ Reply ]</a>
        </Link>
      )}
    </p>

    <p className="post__content">
      {imageURL && <img className="image post__image" src={imageURL} />}
      {comment}
    </p>

    {replies && (
      <ul className="board__replies">
        {replies.map(({_id, name, email, comment, imageURL, createdAt}) => (
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
  </div>
)

export default Post
