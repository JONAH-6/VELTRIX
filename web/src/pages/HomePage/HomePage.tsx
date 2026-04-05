// web/src/pages/HomePage/HomePage.tsx
import { useEffect, useState } from 'react'

import { Link, routes } from '@redwoodjs/router'

import {
  getWalletBalance,
  setWalletBalance,
  getUnlockedLevel,
  setUnlockedLevel,
  MIN_BALANCE_TO_PLAY,
  canPlayAnyGame,
  hasMinimumBalance,
} from 'src/lib/levelHelpers'

const HomePage = () => {
  const [balance, setBalance] = useState(0)
  const [unlocked, setUnlocked] = useState(0)

  const refresh = () => {
    setBalance(getWalletBalance())
    setUnlocked(getUnlockedLevel())
  }

  const addFundsManually = () => {
    const current = getWalletBalance()
    const newBalance = current + 3000
    setWalletBalance(newBalance)
    if (getUnlockedLevel() === 0) setUnlockedLevel(1)
    refresh()
    alert(
      `Payment successful! ₦3,000 added. New balance: ₦${newBalance.toLocaleString()}`
    )
  }

  useEffect(() => {
    refresh()
    const params = new URLSearchParams(window.location.search)
    const reference = params.get('reference')
    if (reference) {
      const processedKey = `processed_${reference}`
      if (!sessionStorage.getItem(processedKey)) {
        sessionStorage.setItem(processedKey, 'true')
        addFundsManually()
        window.history.replaceState({}, '', window.location.pathname)
      }
    }
  }, [])

  const canPlay = canPlayAnyGame()
  const hasMinBalance = hasMinimumBalance()

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
        {balance === 0 && (
          <p className="text-red-400 mt-2">
            You need to add funds before playing.
          </p>
        )}
        {balance > 0 && !hasMinBalance && (
          <p className="text-red-400 mt-2">
            You need at least ₦{MIN_BALANCE_TO_PLAY.toLocaleString()} to play.
            Add more funds.
          </p>
        )}
        {balance >= MIN_BALANCE_TO_PLAY && !canPlay && unlocked === 0 && (
          <p className="text-red-400 mt-2">
            Level 1 is locked. Add funds to unlock.
          </p>
        )}
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
