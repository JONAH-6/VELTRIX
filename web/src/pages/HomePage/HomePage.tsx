// web/src/pages/HomePage/HomePage.tsx
import { useEffect, useState } from 'react'

import { Link, routes } from '@redwoodjs/router'

// Helper functions
const getWallet = () => {
  const bal = localStorage.getItem('veltrix_wallet_balance')
  return bal ? parseFloat(bal) : 0
}
const setWallet = (amount: number) => {
  localStorage.setItem('veltrix_wallet_balance', amount.toString())
}
const getLevel = () => {
  const level = localStorage.getItem('veltrix_unlocked_level')
  return level ? parseInt(level) : 0
}
const setLevel = (level: number) => {
  localStorage.setItem('veltrix_unlocked_level', level.toString())
}

const HomePage = () => {
  const [balance, setBalance] = useState(0)
  const [unlocked, setUnlocked] = useState(0)

  const refresh = () => {
    setBalance(getWallet())
    setUnlocked(getLevel())
  }

  // Add funds automatically when returning from Paystack
  const addFundsManually = () => {
    const current = getWallet()
    const newBalance = current + 3000
    setWallet(newBalance)
    if (getLevel() === 0) setLevel(1)
    refresh()
    alert(
      `Payment successful! ₦3,000 added. New balance: ₦${newBalance.toLocaleString()}`
    )
  }

  useEffect(() => {
    refresh()
    // Check URL for payment reference (auto-add funds)
    const params = new URLSearchParams(window.location.search)
    const reference = params.get('reference')
    if (reference) {
      // Prevent double processing on page refresh
      const processedKey = `processed_${reference}`
      if (!sessionStorage.getItem(processedKey)) {
        sessionStorage.setItem(processedKey, 'true')
        addFundsManually()
        // Clean URL without reloading
        window.history.replaceState({}, '', window.location.pathname)
      }
    }
  }, [])

  const canPlay = balance > 0 && unlocked > 0

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      <div className="bg-gray-800 rounded-lg p-6 my-6">
        <p className="text-gray-400">Wallet Balance</p>
        <p className="text-4xl font-bold text-green-400">
          ₦{balance.toLocaleString()}
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Link
            to={routes.addFunds()}
            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
          >
            Pay with Paystack
          </Link>
          <Link
            to={routes.withdraw()}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Withdraw
          </Link>
        </div>
        {!canPlay && <p className="text-red-400 mt-2">Add funds to play.</p>}
      </div>
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold">Levels</h2>
        <div className="flex gap-3 mt-4 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => {
            const enabled = canPlay && level <= unlocked
            return (
              <Link
                key={level}
                to={routes[`level${level}`]()}
                className={`px-4 py-2 rounded ${enabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 pointer-events-none opacity-50'}`}
              >
                Level {level}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default HomePage
