import { render } from '@redwoodjs/testing/web'

import Level2Page from './Level2Page'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('Level2Page', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Level2Page />)
    }).not.toThrow()
  })
})
