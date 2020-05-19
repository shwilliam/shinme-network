import Link from 'next/link'

const Nav = ({boards, ...props}) => (
  <nav {...props}>
    <h1>
      <Link href="/">
        <a className="nav__title">Shinme Network</a>
      </Link>
    </h1>

    <ul className="nav__list">
      {boards?.map(({_id, title}) => (
        <li className="nav__item" key={title}>
          <Link href="/board/[id]" as={`/board/${_id}`}>
            <a>{title}</a>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
)

export default Nav
