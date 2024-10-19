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
    { href: '', label: 'Coming Soon...' },
  ]

  return (
    <header className="bg-black text-white p-4 font-inter">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="z-10">
          <Image src="/images/logo.png" alt="BTFD.WTF Logo" width={150} height={37.5} className="rounded-full" />
        </Link>
        
        <nav className="hidden lg:flex space-x-8 text-lg">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-purple-200 transition-colors">
              {item.label}
            </Link>
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
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-2xl hover:text-purple-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
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