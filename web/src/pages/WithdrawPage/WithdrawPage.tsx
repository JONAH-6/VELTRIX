// web/src/pages/WithdrawPage/WithdrawPage.tsx

import { useState, useEffect } from 'react'

import { navigate, routes } from '@redwoodjs/router'

const WithdrawPage = () => {
  const [balance, setBalance] = useState<number>(0)
  const [withdrawAmount, setWithdrawAmount] = useState<string>('')
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Load balance from localStorage
  const loadBalance = () => {
    const stored = localStorage.getItem('veltrix_wallet_balance')
    const currentBalance = stored ? parseFloat(stored) : 0
    setBalance(currentBalance)
  }

  useEffect(() => {
    loadBalance()
  }, [])

  const handleWithdraw = () => {
    // Clear previous message
    setMessage(null)

    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount <= 0) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid amount greater than 0.',
      })
      return
    }

    if (amount > balance) {
      setMessage({
        type: 'error',
        text: `Insufficient balance. Your balance is ₦${balance.toLocaleString()}.`,
      })
      return
    }

    setIsProcessing(true)

    // Simulate processing delay (e.g., API call to payment gateway)
    setTimeout(() => {
      const newBalance = balance - amount
      localStorage.setItem('veltrix_wallet_balance', newBalance.toString())
      setBalance(newBalance)
      setWithdrawAmount('')
      setMessage({
        type: 'success',
        text: `Successfully withdrew ₦${amount.toLocaleString()}. New balance: ₦${newBalance.toLocaleString()}`,
      })
      setIsProcessing(false)

      // Optional: redirect after 2 seconds
      // setTimeout(() => navigate(routes.home()), 2000)
    }, 1000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Withdraw Funds</h1>
      <p className="text-gray-400 mb-8">
        Withdraw your winnings to your bank account (simulation mode). No real
        payment integration yet.
      </p>

      {/* Balance Card */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
        <p className="text-sm text-gray-400 uppercase tracking-wide">
          Available Balance
        </p>
        <p className="text-4xl font-bold text-green-400">
          ₦{balance.toLocaleString()}
        </p>
      </div>

      {/* Withdraw Form */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Withdrawal Amount (₦)
        </label>
        <input
          id="amount"
          type="number"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isProcessing}
        />

        <button
          onClick={handleWithdraw}
          disabled={isProcessing || !withdrawAmount}
          className={`mt-6 w-full py-3 rounded-lg font-medium text-lg transition ${
            isProcessing || !withdrawAmount
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isProcessing ? 'Processing...' : 'Withdraw Funds'}
        </button>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-center ${
              message.type === 'success'
                ? 'bg-green-900/50 text-green-300'
                : 'bg-red-900/50 text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      {/* Back to Dashboard Link */}
      <div className="mt-6 text-center">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            navigate(routes.home())
          }}
          className="text-gray-400 hover:text-white transition"
        >
          ← Back to Dashboard
        </a>
      </div>
    </div>
  )
}

export default WithdrawPage
