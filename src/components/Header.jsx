'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ConnectButton } from "thirdweb/react"
import { Menu, X } from 'lucide-react'
import { client } from '@/app/client'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/games', label: 'Games' },
    { href: '', label: 'Staking', comingSoon: true },
    { href: '', label: 'Buy/Sell', comingSoon: true },
    { href: '', label: 'Team', comingSoon: true },
  ]

  const NavLink = ({ item }) => {
    if (item.comingSoon) {
      return (
        <div className="relative group">
          <span className="cursor-pointer hover:text-purple-200 transition-colors">
            {item.label}
          </span>
          <span className="absolute left-1/2 -translate-x-1/2 -bottom-14 bg-white text-black px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Coming Soon
          </span>
        </div>
      )
    }
    return (
      <Link href={item.href} className="hover:text-purple-200 transition-colors">
        {item.label}
      </Link>
    )
  }

  return (
    <header className="bg-black text-white p-4 font-inter">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="z-10">
          <Image src="/images/logo.png" alt="BTFD.WTF Logo" width={150} height={37.5} className="rounded-full" />
        </Link>
        
        <nav className="hidden lg:flex space-x-8 text-lg">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
        
        <div className="flex items-center space-x-3">
          <div className="lg:hidden">
            <ConnectButton client={client} />
          </div>
          <button onClick={toggleMobileMenu} className="lg:hidden z-10">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="hidden lg:block">
            <ConnectButton connectButton={{
              style: {
                borderRadius: "10px",
              },
            }} client={client} />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-purple-900 bg-opacity-95 z-50 lg:hidden">
            <div className="flex flex-col items-center justify-center h-full space-y-8 relative">
              {navItems.map((item) => (
                <div key={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <NavLink item={item} />
                </div>
              ))}
              <button 
                className="absolute top-4 right-4 text-white hover:text-purple-200 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}