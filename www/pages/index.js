import {Nav} from '../components'

export async function getServerSideProps() {
  const boards = await fetch(`${process.env.API_ENDPOINT}/boards`).then(res =>
    res.json(),
  )

  return {
    props: {boards},
  }
}

const Home = ({boards}) => (
  <div className="site__layout">
    <h1 className="visibly-hidden">Shinme Network</h1>
    <Nav className="site__nav" boards={boards} />

    <main className="site__main">
      <p className="site__welcome">
        Welcome to shinme.network, an open image- and text-board. Please post
        any requests in the <a href="/board/requests">requests board</a> and
        submit any issues or improvements you would like to see{' '}
        <a href="https://github.com/shwilliam/shinme-network/issues">here</a>.
      </p>

      <span className="sprout" role="img" aria-label="">
        🌱
      </span>
    </main>
  </div>
)

export default Home
