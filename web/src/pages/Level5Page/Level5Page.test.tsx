import { render } from '@redwoodjs/testing/web'

import Level5Page from './Level5Page'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('Level5Page', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Level5Page />)
    }).not.toThrow()
  })
})
