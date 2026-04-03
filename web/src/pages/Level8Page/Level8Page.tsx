// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const Level8Page = () => {
  return (
    <>
      <Metadata title="Level8" description="Level8 page" />

      <h1>Level8Page</h1>
      <p>
        Find me in <code>./web/src/pages/Level8Page/Level8Page.tsx</code>
      </p>
      {/*
          My default route is named `level8`, link to me with:
          `<Link to={routes.level8()}>Level8</Link>`
      */}
    </>
  )
}

export default Level8Page
