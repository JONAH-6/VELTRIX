// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const Level6Page = () => {
  return (
    <>
      <Metadata title="Level6" description="Level6 page" />

      <h1>Level6Page</h1>
      <p>
        Find me in <code>./web/src/pages/Level6Page/Level6Page.tsx</code>
      </p>
      {/*
          My default route is named `level6`, link to me with:
          `<Link to={routes.level6()}>Level6</Link>`
      */}
    </>
  )
}

export default Level6Page
