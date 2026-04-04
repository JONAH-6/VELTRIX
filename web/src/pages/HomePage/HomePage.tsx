// web/src/pages/HomePage/HomePage.tsx
import { useEffect, useState } from 'react'

import { Link, routes } from '@redwoodjs/router'

import {
  getWalletBalance,
  setWalletBalance,
  getUnlockedLevel,
  setUnlockedLevel,
  canPlayAnyGame,
} from 'src/lib/levelHelpers'

const HomePage = () => {
  const [walletBalance, setWalletBalanceState] = useState(0)
  const [unlockedLevel, setUnlockedLevelState] = useState(0)

  const refreshData = () => {
    setWalletBalanceState(getWalletBalance())
    setUnlockedLevelState(getUnlockedLevel())
  }

  // Load balance and unlocked level on mount & storage changes
  useEffect(() => {
    refreshData()
    window.addEventListener('storage', refreshData)
    return () => window.removeEventListener('storage', refreshData)
  }, [])

  // Detect payment success from URL parameters (after Paystack redirect)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const reference = urlParams.get('reference')
    const paymentSuccess = urlParams.get('payment_success') === 'true'

    if (paymentSuccess && reference) {
      // Payment successful – add ₦3,000 and unlock Level 1 if needed
      const currentBalance = getWalletBalance()
      const newBalance = currentBalance + 3000
      setWalletBalance(newBalance)
      if (getUnlockedLevel() === 0) {
        setUnlockedLevel(1)
      }
      alert('Payment successful! ₦3,000 added to your wallet.')
      // Remove query parameters from URL without reloading
      window.history.replaceState({}, '', window.location.pathname)
      refreshData()
    }
  }, [])

  const clearBalance = () => {
    localStorage.setItem('veltrix_wallet_balance', '0')
    refreshData()
  }

  const canPlay = canPlayAnyGame()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Manage your funds and start playing
        </p>
      </div>

      {/* Wallet Card */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-gray-400 uppercase tracking-wide">
              Wallet Balance
            </p>
            <p className="text-4xl font-bold text-green-400">
              ₦{walletBalance.toLocaleString()}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to={routes.addFunds()}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition"
            >
              Add Funds (₦3,000)
            </Link>
            <Link
              to={routes.withdraw()}
              className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition"
            >
              Withdraw
            </Link>
            <button
              onClick={clearBalance}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
            >
              Clear Balance
            </button>
          </div>
        </div>
        {!canPlay && (
          <p className="text-red-400 text-sm mt-2">
            You need to add funds before playing.
          </p>
        )}
      </div>

      {/* Game Info Card */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-3">How to Play</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Add ₦3,000 to start playing.</li>
          <li>You must beat Level 1 to unlock Level 2, etc.</li>
          <li>Each level you beat doubles your wallet balance.</li>
          <li>
            After winning, you can choose to cash out or continue to next level.
          </li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => {
            const enabled = canPlay && level <= unlockedLevel
            return (
              <Link
                key={level}
                to={routes[`level${level}`]()}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  enabled
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-600 cursor-not-allowed pointer-events-none opacity-50'
                }`}
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
