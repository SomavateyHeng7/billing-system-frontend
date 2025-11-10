"use client"

import React from "react"
import { Bell, Search, User, Settings, LogOut, ChevronDown } from "lucide-react"
import { Button } from "../ui/button"
import { ModeToggle } from "./mode-toggle"

interface HeaderProps {
  sidebarCollapsed?: boolean
}

export function Header({ sidebarCollapsed = false }: HeaderProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header 
      className="fixed top-0 right-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-all duration-300"
      style={{
        left: sidebarCollapsed ? '56px' : '224px'
      }}
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients, invoices, reports..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Dark/Light Mode Toggle */}
          <ModeToggle />

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Dr. Sarah Wilson
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Administrator
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Dr. Sarah Wilson
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    sarah.wilson@hospital.com
                  </p>
                </div>
                
                <div className="py-1">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <User className="h-4 w-4 mr-3" />
                    View Profile
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Settings className="h-4 w-4 mr-3" />
                    Account Settings
                  </button>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
