// web/src/pages/AddFundsPage/AddFundsPage.tsx

import { useState } from 'react'

import { navigate, routes } from '@redwoodjs/router'

const AddFundsPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const plans = [
    { amount: 3000, label: 'Basic Plan', naira: '₦3,000' },
    { amount: 7000, label: 'Standard Plan', naira: '₦7,000' },
    { amount: 14000, label: 'Premium Plan', naira: '₦14,000' },
  ]

  const handleAddFunds = () => {
    if (!selectedPlan) return

    setIsProcessing(true)

    // Get current wallet balance from localStorage
    const currentBalanceStr = localStorage.getItem('veltrix_wallet_balance')
    const currentBalance = currentBalanceStr ? parseFloat(currentBalanceStr) : 0

    // Add selected plan amount
    const newBalance = currentBalance + selectedPlan

    // Save updated balance
    localStorage.setItem('veltrix_wallet_balance', newBalance.toString())

    // Simulate short delay to show "processing" (optional)
    setTimeout(() => {
      setIsProcessing(false)
      // Redirect to Level 1 to start game
      navigate(routes.level1())
    }, 500)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Add Funds</h1>
      <p className="text-gray-400 mb-8">
        Select a plan to add money to your wallet. You'll start from Level 1.
      </p>

      {/* Plan Selection Cards */}
      <div className="space-y-4 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.amount}
            onClick={() => setSelectedPlan(plan.amount)}
            className={`
                cursor-pointer rounded-lg border-2 p-4 transition-all
                ${
                  selectedPlan === plan.amount
                    ? 'border-purple-500 bg-purple-900/20'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-500'
                }
              `}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {plan.label}
                </h3>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  {plan.naira}
                </p>
              </div>
              <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                {selectedPlan === plan.amount && (
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Funds Button */}
      <button
        onClick={handleAddFunds}
        disabled={!selectedPlan || isProcessing}
        className={`
            w-full py-3 rounded-lg font-medium text-lg transition
            ${
              !selectedPlan || isProcessing
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }
          `}
      >
        {isProcessing
          ? 'Processing...'
          : `Add ${selectedPlan ? `₦${selectedPlan.toLocaleString()}` : 'Funds'}`}
      </button>

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

export default AddFundsPage
