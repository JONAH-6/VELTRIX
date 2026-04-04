// web/src/pages/AddFundsSuccessPage/AddFundsSuccessPage.tsx
import { useEffect } from 'react'

import { navigate, routes } from '@redwoodjs/router'

import {
  getWalletBalance,
  setWalletBalance,
  getUnlockedLevel,
  setUnlockedLevel,
} from 'src/lib/levelHelpers'

const AddFundsSuccessPage = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const reference = urlParams.get('reference')
    const trxref = urlParams.get('trxref')

    console.log('Success page loaded. Params:', { reference, trxref })

    if (reference && trxref && reference === trxref) {
      // Prevent double processing
      const processedKey = `processed_${reference}`
      if (sessionStorage.getItem(processedKey)) {
        console.log('Already processed, redirecting to home')
        navigate(routes.home())
        return
      }
      sessionStorage.setItem(processedKey, 'true')

      // Update wallet
      const currentBalance = getWalletBalance()
      const newBalance = currentBalance + 3000
      setWalletBalance(newBalance)
      console.log('Balance updated:', newBalance)

      // Unlock Level 1 if needed
      let currentUnlocked = getUnlockedLevel()
      if (currentUnlocked === 0) {
        setUnlockedLevel(1)
        currentUnlocked = 1
        console.log('Level 1 unlocked')
      }
    }

    // Redirect to home after 1 second (enough time to process)
    setTimeout(() => {
      navigate(routes.home())
    }, 1000)
  }, [])

  return (
    <div className="flex items-center justify-center h-full bg-gray-900">
      <div className="text-white text-xl">
        Payment confirmed! Updating your wallet...
      </div>
    </div>
  )
}

export default AddFundsSuccessPage
