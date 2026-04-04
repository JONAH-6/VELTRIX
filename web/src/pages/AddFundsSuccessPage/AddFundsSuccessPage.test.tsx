import { render } from '@redwoodjs/testing/web'

import AddFundsSuccessPage from './AddFundsSuccessPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AddFundsSuccessPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AddFundsSuccessPage />)
    }).not.toThrow()
  })
})
