import Head from 'next/head'
import Nav from '../components/nav'

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
    <Head>
      <title>Shinme Network</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Nav className="site__nav" boards={boards} />

    <main className="site__main">
      <span role="img" aria-label="seedling">
        🌱
      </span>
    </main>
  </div>
)

export default Home
