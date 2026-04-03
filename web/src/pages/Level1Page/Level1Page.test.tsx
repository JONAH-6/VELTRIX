import { render } from '@redwoodjs/testing/web'

import Level1Page from './Level1Page'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('Level1Page', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Level1Page />)
    }).not.toThrow()
  })
})
