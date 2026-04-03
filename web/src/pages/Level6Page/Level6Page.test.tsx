import { render } from '@redwoodjs/testing/web'

import Level6Page from './Level6Page'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('Level6Page', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Level6Page />)
    }).not.toThrow()
  })
})
