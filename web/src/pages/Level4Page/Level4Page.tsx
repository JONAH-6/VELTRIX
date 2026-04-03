// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const Level4Page = () => {
  return (
    <>
      <Metadata title="Level4" description="Level4 page" />

      <h1>Level4Page</h1>
      <p>
        Find me in <code>./web/src/pages/Level4Page/Level4Page.tsx</code>
      </p>
      {/*
          My default route is named `level4`, link to me with:
          `<Link to={routes.level4()}>Level4</Link>`
      */}
    </>
  )
}

export default Level4Page
