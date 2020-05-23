import {format} from '../utils'

export const Reply = ({name, comment, createdAt, imageURL}) => (
  <section className="reply">
    <header className="reply__header">
      <span className="reply__name">{name || 'anon'}</span>
      <span className="reply__date">{createdAt && format(createdAt)}</span>
    </header>

    <p className="reply__content">
      {imageURL && <img className="image reply__image" src={imageURL} />}
      {comment}
    </p>
  </section>
)
