// web/src/pages/WithdrawPage/WithdrawPage.tsx
import { useState, useEffect } from 'react'

import { useForm } from '@formspree/react'

import { navigate, routes } from '@redwoodjs/router'

const WithdrawPage = () => {
  const [balance, setBalance] = useState<number>(0)
  const [withdrawAmount, setWithdrawAmount] = useState<string>('')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [bankName, setBankName] = useState('')
  const [localMessage, setLocalMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // Formspree hook
  const [state, handleSubmit] = useForm('xvzvdpzv') // Your Formspree endpoint

  // Load balance from localStorage
  const loadBalance = () => {
    const stored = localStorage.getItem('veltrix_wallet_balance')
    const currentBalance = stored ? parseFloat(stored) : 0
    setBalance(currentBalance)
  }

  useEffect(() => {
    loadBalance()
  }, [])

  // Reset local message when form state changes
  useEffect(() => {
    if (state.succeeded) {
      const amount = parseFloat(withdrawAmount)
      if (!isNaN(amount) && amount > 0 && amount <= balance) {
        const newBalance = balance - amount
        localStorage.setItem('veltrix_wallet_balance', newBalance.toString())
        setBalance(newBalance)
        setWithdrawAmount('')
        setAccountName('')
        setAccountNumber('')
        setBankName('')
        setLocalMessage({
          type: 'success',
          text: `Your withdrawal request of ₦${amount.toLocaleString()} has been submitted. You will receive your money within 4 hours.`,
        })
      }
    } else if (state.errors && !state.submitting) {
      setLocalMessage({
        type: 'error',
        text: 'Form submission failed. Please try again.',
      })
    }
  }, [state.succeeded, state.errors, state.submitting])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocalMessage(null)

    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount < 9500) {
      setLocalMessage({
        type: 'error',
        text: 'Minimum withdrawal amount is ₦9,500.',
      })
      return
    }
    if (amount > balance) {
      setLocalMessage({
        type: 'error',
        text: `Insufficient balance. Your balance is ₦${balance.toLocaleString()}.`,
      })
      return
    }
    if (!accountName.trim() || !accountNumber.trim() || !bankName.trim()) {
      setLocalMessage({
        type: 'error',
        text: 'Please fill in all bank details.',
      })
      return
    }

    // Submit to Formspree
    handleSubmit(e)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Withdraw Funds</h1>
      <p className="text-gray-400 mb-8">
        Withdraw your winnings to your bank account. Minimum withdrawal: ₦9,500.
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
        <form onSubmit={onSubmit}>
          {/* Amount */}
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Amount (₦) * minimum 9,500
            </label>
            <input
              id="amount"
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={state.submitting}
              required
            />
          </div>

          {/* Account Name */}
          <div className="mb-4">
            <label
              htmlFor="accountName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Account Holder Name
            </label>
            <input
              id="accountName"
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Full name as on bank account"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={state.submitting}
              required
            />
          </div>

          {/* Account Number */}
          <div className="mb-4">
            <label
              htmlFor="accountNumber"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Account Number
            </label>
            <input
              id="accountNumber"
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="10-digit account number"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={state.submitting}
              required
            />
          </div>

          {/* Bank Name */}
          <div className="mb-4">
            <label
              htmlFor="bankName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Bank Name
            </label>
            <input
              id="bankName"
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g., GTBank, First Bank, etc."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={state.submitting}
              required
            />
          </div>

          {/* Hidden fields to send extra info to Formspree */}
          <input type="hidden" name="amount" value={withdrawAmount} />
          <input type="hidden" name="accountName" value={accountName} />
          <input type="hidden" name="accountNumber" value={accountNumber} />
          <input type="hidden" name="bankName" value={bankName} />

          <button
            type="submit"
            disabled={state.submitting}
            className={`mt-4 w-full py-3 rounded-lg font-medium text-lg transition ${
              state.submitting
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {state.submitting ? 'Submitting...' : 'Request Withdrawal'}
          </button>

          {localMessage && (
            <div
              className={`mt-4 p-3 rounded-lg text-center ${
                localMessage.type === 'success'
                  ? 'bg-green-900/50 text-green-300'
                  : 'bg-red-900/50 text-red-300'
              }`}
            >
              {localMessage.text}
            </div>
          )}
        </form>
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
