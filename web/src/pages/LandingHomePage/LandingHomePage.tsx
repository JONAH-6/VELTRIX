// web/src/pages/LandingHomePage/LandingHomePage.tsx
import { Link, routes } from '@redwoodjs/router'

const LandingHomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 sm:py-32 lg:py-40">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              <span className="block">Answer. Help. Earn.</span>
              <span className="block text-purple-400 mt-2">
                Private aviation Q&A for learners
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
              Students study aviation. You answer their questions. You get paid
              – completely private.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                to={routes.addFunds()}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-white transition transform hover:scale-105"
              >
                Start Earning
              </Link>
              <Link
                to={routes.home()}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-white transition"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">How It Works</h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Help students understand aviation. Every correct answer earns you
            money. Private, simple, no tracking.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-800 rounded-2xl p-6 text-center shadow-xl border border-gray-700">
            <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">
              Answer Questions
            </h3>
            <p className="mt-2 text-gray-400">
              Students submit aviation questions. You provide the correct answer
              and explanation.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800 rounded-2xl p-6 text-center shadow-xl border border-gray-700">
            <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">
              Get Paid Instantly
            </h3>
            <p className="mt-2 text-gray-400">
              Each approved answer adds money to your private wallet. No delays,
              no fees.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800 rounded-2xl p-6 text-center shadow-xl border border-gray-700">
            <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">
              Totally Private
            </h3>
            <p className="mt-2 text-gray-400">
              No one knows you're earning. No leaderboards, no public profiles –
              just your private dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-800/50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Ready to help students and earn?
          </h2>
          <p className="mt-4 text-gray-300">
            Add a small amount to start answering. Your earnings will grow with
            every correct answer.
          </p>
          <Link
            to={routes.addFunds()}
            className="inline-block mt-8 px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-white transition transform hover:scale-105"
          >
            Get Started Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <p>
          © {new Date().getFullYear()} VELTRIX – Private Aviation Q&A. Earnings
          are real and confidential.
        </p>
      </footer>
    </div>
  )
}

export default LandingHomePage
