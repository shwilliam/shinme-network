import {Nav} from '../components'
import {useEffect, useState} from 'react'
import {API_ENDPOINT} from '../utils'

const FourOhFour = () => {
  const [boards, setBoards] = useState([])
  useEffect(() => {
    ;(async () => {
      const boards = await fetch(`${API_ENDPOINT}/boards`).then(res =>
        res.json(),
      )
      setBoards(boards)
    })()
  }, [])

  return (
    <div className="site__layout">
      <h1 className="visibly-hidden">404</h1>
      <Nav className="site__nav" boards={boards} />

      <main className="site__main">
        <p className="site__welcome">
          Looks like nothing is here. If you think there should be, bring it up
          in the <a href="/board/requests">requests board</a>.
        </p>
        <p>
          If you think this is a bug, please explain it{' '}
          <a href="https://github.com/shwilliam/shinme-network/issues">here</a>.
        </p>
      </main>
    </div>
  )
}

export default FourOhFour
