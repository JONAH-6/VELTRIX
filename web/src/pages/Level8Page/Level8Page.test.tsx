import { render } from '@redwoodjs/testing/web'

import Level8Page from './Level8Page'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('Level8Page', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Level8Page />)
    }).not.toThrow()
  })
})
