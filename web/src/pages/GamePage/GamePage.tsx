// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const GamePage = () => {
  return (
    <>
      <Metadata title="Game" description="Game page" />

      <h1>GamePage</h1>
      <p>
        Find me in <code>./web/src/pages/GamePage/GamePage.tsx</code>
      </p>
      {/*
          My default route is named `game`, link to me with:
          `<Link to={routes.game()}>Game</Link>`
      */}
    </>
  )
}

export default GamePage
