// web/src/layouts/MainLayout/MainLayout.tsx
import { useState, useEffect } from 'react'

import { Link, routes } from '@redwoodjs/router'

interface MainLayoutProps {
  children?: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      // Auto-close sidebar on mobile when resizing to large
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false) // optional: you can keep it open on desktop if you prefer
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    if (isMobile) setIsSidebarOpen(false)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Top Bar with Logo & Hamburger */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-3 md:hidden">
        {/* Logo (always visible) */}
        <div>
          <h1 className="text-xl font-bold text-purple-400">VELTRIX</h1>
          <p className="text-xs text-gray-400">Survival Arena</p>
        </div>
        {/* Hamburger Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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

      {/* Desktop: show logo in sidebar or top? We'll keep sidebar for desktop with its own logo */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out
            md:relative md:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {/* Logo inside sidebar (visible when open) */}
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-purple-400">VELTRIX</h1>
            <p className="text-xs text-gray-400 mt-1">Survival Arena</p>
          </div>

          {/* Navigation Links */}
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
              <Link
                to={routes.level1()}
                className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={closeSidebar}
              >
                Level 1
              </Link>
              <Link
                to={routes.level2()}
                className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={closeSidebar}
              >
                Level 2
              </Link>
              <Link
                to={routes.level3()}
                className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={closeSidebar}
              >
                Level 3
              </Link>
              <Link
                to={routes.level4()}
                className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={closeSidebar}
              >
                Level 4
              </Link>
              <Link
                to={routes.level5()}
                className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={closeSidebar}
              >
                Level 5
              </Link>
              <Link
                to={routes.level6()}
                className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={closeSidebar}
              >
                Level 6
              </Link>
              <Link
                to={routes.level7()}
                className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={closeSidebar}
              >
                Level 7
              </Link>
              <Link
                to={routes.level8()}
                className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={closeSidebar}
              >
                Level 8
              </Link>
            </div>
          </nav>

          {/* User info at bottom */}
          <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
            player@example.com
          </div>
        </aside>

        {/* Backdrop for mobile when sidebar is open */}
        {isSidebarOpen && isMobile && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
            onClick={closeSidebar}
          />
        )}

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

export default MainLayout
