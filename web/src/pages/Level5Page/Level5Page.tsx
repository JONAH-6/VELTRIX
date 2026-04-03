// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const Level5Page = () => {
  return (
    <>
      <Metadata title="Level5" description="Level5 page" />

      <h1>Level5Page</h1>
      <p>
        Find me in <code>./web/src/pages/Level5Page/Level5Page.tsx</code>
      </p>
      {/*
          My default route is named `level5`, link to me with:
          `<Link to={routes.level5()}>Level5</Link>`
      */}
    </>
  )
}

export default Level5Page
