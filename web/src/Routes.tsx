// web/src/Routes.tsx

import { Router, Route, Set } from '@redwoodjs/router'

import MainLayout from 'src/layouts/MainLayout/MainLayout'

// Page imports
import AddFundsPage from 'src/pages/AddFundsPage/AddFundsPage'
import AddFundsSuccessPage from 'src/pages/AddFundsSuccessPage/AddFundsSuccessPage'
import GamePage from 'src/pages/GamePage/GamePage'
import HomePage from 'src/pages/HomePage/HomePage'
import Level1Page from 'src/pages/Level1Page/Level1Page'
import Level2Page from 'src/pages/Level2Page/Level2Page'
import Level3Page from 'src/pages/Level3Page/Level3Page'
import Level4Page from 'src/pages/Level4Page/Level4Page'
import Level5Page from 'src/pages/Level5Page/Level5Page'
import Level6Page from 'src/pages/Level6Page/Level6Page'
import Level7Page from 'src/pages/Level7Page/Level7Page'
import Level8Page from 'src/pages/Level8Page/Level8Page'
import NotFoundPage from 'src/pages/NotFoundPage/NotFoundPage'
import WithdrawPage from 'src/pages/WithdrawPage/WithdrawPage'

const Routes = () => {
  return (
    <Router>
      {/* All main pages use MainLayout */}
      <Set wrap={MainLayout}>
        <Route path="/" page={HomePage} name="home" />
        <Route path="/add-funds-success" page={AddFundsSuccessPage} name="addFundsSuccess" />
        <Route path="/add-funds" page={AddFundsPage} name="addFunds" />
        <Route path="/add-funds/success" page={AddFundsPage} name="addFundsSuccess" /> {/* 👈 ADD THIS */}
        <Route path="/withdraw" page={WithdrawPage} name="withdraw" />
        <Route path="/game" page={GamePage} name="game" />
        {/* Game Levels */}
        <Route path="/level1" page={Level1Page} name="level1" />
        <Route path="/level2" page={Level2Page} name="level2" />
        <Route path="/level3" page={Level3Page} name="level3" />
        <Route path="/level4" page={Level4Page} name="level4" />
        <Route path="/level5" page={Level5Page} name="level5" />
        <Route path="/level6" page={Level6Page} name="level6" />
        <Route path="/level7" page={Level7Page} name="level7" />
        <Route path="/level8" page={Level8Page} name="level8" />
      </Set>

      {/* Not Found - no layout */}
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
