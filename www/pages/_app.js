import Head from 'next/head'
import '../css/global.css'

const App = ({Component, pageProps}) => (
  <>
    <Head>
      <title>Shinme Network</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Component {...pageProps} />
  </>
)

export default App
