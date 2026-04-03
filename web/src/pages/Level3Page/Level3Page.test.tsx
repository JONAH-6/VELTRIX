import { render } from '@redwoodjs/testing/web'

import Level3Page from './Level3Page'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('Level3Page', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Level3Page />)
    }).not.toThrow()
  })
})
