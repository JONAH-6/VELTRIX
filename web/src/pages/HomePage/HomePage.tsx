// web/src/pages/HomePage/HomePage.tsx
import { useEffect, useState } from 'react'

import { Link, routes } from '@redwoodjs/router'

const HomePage = () => {
  const [walletBalance, setWalletBalance] = useState<number>(0)

  useEffect(() => {
    const storedBalance = localStorage.getItem('veltrix_wallet_balance')
    if (storedBalance) {
      setWalletBalance(parseFloat(storedBalance))
    } else {
      setWalletBalance(0)
    }
  }, [])

  const clearBalance = () => {
    localStorage.setItem('veltrix_wallet_balance', '0')
    setWalletBalance(0)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Welcome Header */}
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
              Add Funds
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
      </div>

      {/* Game Info Card */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-3">How to Play</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Add funds to your wallet using one of the available plans.</li>
          <li>Start from Level 1 and defeat enemies to progress.</li>
          <li>Each level you beat doubles your wallet balance.</li>
          <li>
            If you lose, you keep the money earned up to the last beaten level.
          </li>
          <li>Withdraw your earnings anytime from the Withdraw page.</li>
        </ul>
        <div className="mt-6">
          <Link
            to={routes.level1()}
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
          >
            Start Game (Level 1)
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
