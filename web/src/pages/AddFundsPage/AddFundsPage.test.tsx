import { render } from '@redwoodjs/testing/web'

import AddFundsPage from './AddFundsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AddFundsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AddFundsPage />)
    }).not.toThrow()
  })
})
