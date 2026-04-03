import { render } from '@redwoodjs/testing/web'

import Level4Page from './Level4Page'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('Level4Page', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Level4Page />)
    }).not.toThrow()
  })
})
