// web/src/pages/AddFundsPage/AddFundsPage.tsx
import { useState } from 'react'

import { navigate, routes } from '@redwoodjs/router'

// IMPORTANT: Replace with your actual Paystack payment page link
const PAYSTACK_PAYMENT_URL = 'https://paystack.shop/pay/planss1'

const AddFundsPage = () => {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAddFunds = () => {
    setIsProcessing(true)
    window.location.href = PAYSTACK_PAYMENT_URL
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Add Funds</h1>
      <p className="text-gray-400 mb-8">
        Add ₦3,000 to your wallet and start playing.
      </p>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
        <h3 className="text-xl font-semibold text-white">Basic Plan</h3>
        <p className="text-3xl font-bold text-green-400 mt-2">₦3,000</p>
        <p className="text-gray-400 mt-2">
          One-time payment to unlock gameplay.
        </p>
      </div>

      <button
        onClick={handleAddFunds}
        disabled={isProcessing}
        className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-lg transition disabled:bg-gray-600"
      >
        {isProcessing ? 'Redirecting...' : 'Pay ₦3,000 with Paystack'}
      </button>

      <div className="mt-6 text-center">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            navigate(routes.home())
          }}
          className="text-gray-400 hover:text-white"
        >
          ← Back to Dashboard
        </a>
      </div>
    </div>
  )
}

export default AddFundsPage
