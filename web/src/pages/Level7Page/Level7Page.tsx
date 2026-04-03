// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const Level7Page = () => {
  return (
    <>
      <Metadata title="Level7" description="Level7 page" />

      <h1>Level7Page</h1>
      <p>
        Find me in <code>./web/src/pages/Level7Page/Level7Page.tsx</code>
      </p>
      {/*
          My default route is named `level7`, link to me with:
          `<Link to={routes.level7()}>Level7</Link>`
      */}
    </>
  )
}

export default Level7Page
