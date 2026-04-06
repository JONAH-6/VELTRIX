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
      <div className="my-6 p-[2px] rounded-2xl bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
        <div
          className="rounded-2xl p-6 bg-[#1f2937]
    shadow-[inset_4px_4px_10px_rgba(0,0,0,0.4),inset_-4px_-4px_10px_rgba(255,255,255,0.05)]"
        >
          <p className="text-gray-400 text-sm tracking-wide">Wallet Balance</p>

          {/* BALANCE DISPLAY */}
          <div
            className="mt-3 inline-block px-6 py-4 rounded-xl
      bg-[#1f2937]
      shadow-[inset_3px_3px_8px_rgba(0,0,0,0.5),inset_-3px_-3px_8px_rgba(255,255,255,0.06)]"
          >
            <p className="text-4xl font-bold text-green-400 tracking-tight">
              ₦{balance.toLocaleString()}
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to={routes.addFunds()}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 transition-all duration-200 shadow-md"
            >
              Pay with Paystack
            </Link>

            <Link
              to={routes.withdraw()}
              className="px-5 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 transition-all duration-200 shadow-md"
            >
              Withdraw
            </Link>
          </div>

          {/* WARNINGS */}
          {balance === 0 && (
            <p className="text-red-400 mt-4 text-sm">
              You need to add funds before playing.
            </p>
          )}

          {balance > 0 && !hasMinBalance && (
            <p className="text-red-400 mt-4 text-sm">
              You need at least ₦{MIN_BALANCE_TO_PLAY.toLocaleString()} to play.
            </p>
          )}

          {balance >= MIN_BALANCE_TO_PLAY && !canPlay && unlocked === 0 && (
            <p className="text-red-400 mt-4 text-sm">
              Level 1 is locked. Add funds to unlock.
            </p>
          )}
        </div>
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
