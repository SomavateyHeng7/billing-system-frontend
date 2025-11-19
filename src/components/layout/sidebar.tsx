"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Users,
  Shield,
  CreditCard, 
  DollarSign,
  ShoppingCart
} from "lucide-react"

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: LayoutDashboard 
  },
  { 
    name: 'POS', 
    href: '/pos', 
    icon: ShoppingCart 
  },
  { 
    name: 'Invoices', 
    href: '/invoices', 
    icon: FileText 
  },
  // { 
  //   name: 'Payments', 
  //   href: '/payments', 
  //   icon: CreditCard 
  // },
  { 
    name: 'Insurance', 
    href: '/insurance', 
    icon: Shield 
  },
  { 
    name: 'Revenue', 
    href: '/revenue', 
    icon: DollarSign 
  },
]

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const [logoError, setLogoError] = useState(false)
  const pathname = usePathname()

  const handleLogoError = () => {
    setLogoError(true)
  }

  const toggleCollapse = () => {
    onToggleCollapse?.()
  }

  // Fix hydration error: always render the same className string on server and client
  const sidebarWidth = isCollapsed ? 'w-14' : 'w-56'

  return (
    <div className={`flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 ${sidebarWidth} h-screen fixed left-0 top-0 z-20`}>
      {/* Logo */}
      <div className="flex h-14 items-center px-3 relative">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            {!logoError ? (
              <Image
                src="/image/logo.png"
                alt="MediBill Pro Logo"
                width={28}
                height={28}
                className="w-7 h-7 object-contain"
                onError={handleLogoError}
                priority
              />
            ) : (
              <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                <FileText className="h-4 w-4 text-white" />
              </div>
            )}
            <span className="text-lg font-bold text-gray-800 dark:text-gray-100 tracking-tight">
              MediBill Pro
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            {!logoError ? (
              <Image
                src="/image/logo.png"
                alt="MediBill Pro Logo"
                width={28}
                height={28}
                className="w-7 h-7 object-contain"
                onError={handleLogoError}
                priority
              />
            ) : (
              <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                <FileText className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        )}
        
        {/* Toggle Button */}
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full p-1.5 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 py-4 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <li key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} rounded-xl py-2.5 transition-all duration-200 relative overflow-hidden ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className={`${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'} flex-shrink-0 transition-all duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
                  {!isCollapsed && (
                    <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
                      {item.name}
                    </span>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-400 rounded-l-full" />
                  )}
                  {isActive && isCollapsed && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-400 rounded-l-full" />
                  )}
                </Link>
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
