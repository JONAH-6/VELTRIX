import { render } from '@redwoodjs/testing/web'

import LandingHomePage from './LandingHomePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('LandingHomePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<LandingHomePage />)
    }).not.toThrow()
  })
})
