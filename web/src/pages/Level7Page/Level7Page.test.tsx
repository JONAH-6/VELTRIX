import { render } from '@redwoodjs/testing/web'

import Level7Page from './Level7Page'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('Level7Page', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Level7Page />)
    }).not.toThrow()
  })
})
