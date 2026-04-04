// web/src/layouts/MainLayout/MainLayout.tsx
import { useState, useEffect } from 'react'

import { Link, routes } from '@redwoodjs/router'

import { getWalletBalance, getUnlockedLevel } from 'src/lib/levelHelpers'

interface MainLayoutProps {
  children?: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)
  const [unlockedLevel, setUnlockedLevel] = useState(0)

  useEffect(() => {
    const updateData = () => {
      setWalletBalance(getWalletBalance())
      setUnlockedLevel(getUnlockedLevel())
    }
    updateData()
    window.addEventListener('storage', updateData)
    return () => window.removeEventListener('storage', updateData)
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) setIsSidebarOpen(false)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => isMobile && setIsSidebarOpen(false)

  const canPlay = walletBalance > 0 && unlockedLevel > 0

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Top bar (mobile) */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-3 md:hidden">
        <div>
          <h1 className="text-xl font-bold text-purple-400">VELTRIX</h1>
          <p className="text-xs text-gray-400">Survival Arena</p>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-purple-400">VELTRIX</h1>
            <p className="text-xs text-gray-400 mt-1">Survival Arena</p>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <Link
              to={routes.home()}
              className="block px-4 py-2 rounded hover:bg-gray-700 transition"
              onClick={closeSidebar}
            >
              Dashboard
            </Link>
            <Link
              to={routes.addFunds()}
              className="block px-4 py-2 rounded hover:bg-gray-700 transition"
              onClick={closeSidebar}
            >
              Add Funds
            </Link>
            <Link
              to={routes.withdraw()}
              className="block px-4 py-2 rounded hover:bg-gray-700 transition"
              onClick={closeSidebar}
            >
              Withdraw
            </Link>
            <div className="pt-4 mt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500 uppercase tracking-wider px-4 mb-2">
                Game Levels
              </p>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => {
                const enabled = canPlay && level <= unlockedLevel
                return (
                  <Link
                    key={level}
                    to={routes[`level${level}`]()}
                    className={`block px-4 py-2 rounded transition ${enabled ? 'hover:bg-gray-700' : 'opacity-50 cursor-not-allowed pointer-events-none'}`}
                    onClick={closeSidebar}
                  >
                    Level {level}
                  </Link>
                )
              })}
            </div>
          </nav>

          <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
            {walletBalance > 0
              ? `Balance: ₦${walletBalance.toLocaleString()}`
              : 'No funds'}
          </div>
        </aside>

        {/* Backdrop */}
        {isSidebarOpen && isMobile && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={closeSidebar}
          />
        )}

        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

export default MainLayout
