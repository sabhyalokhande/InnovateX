"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CuroGenixLogo } from "@/components/ui/curogenix-logo"
import { Package, Upload, BarChart3, MapPin, Bell, Settings, Menu, User, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"



interface PharmacyLayoutProps {
  children: React.ReactNode
}

export function PharmacyLayout({ children }: PharmacyLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [pharmacyName, setPharmacyName] = useState("Pharmacy")

  const handleSignOut = () => {
    localStorage.removeItem('token')
    router.push('/pharmacy/login')
  }

  // Get current user and pharmacy info
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        // Use pharmacy name from user data, fallback to user name
        const name = data.pharmacyInfo?.name || data.name || "Pharmacy";
        setPharmacyName(name);
      })
      .catch(err => {
        console.error('Failed to fetch user:', err);
        setPharmacyName("Pharmacy");
      });
    }
  }, []);

  return (
    <div className="min-h-screen liquid-glass-bg text-white">
      {/* SVG Filter for Liquid Distortion */}
      <svg style={{ display: "none" }}>
        <filter id="liquidGlass">
          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="turb" />
          <feDisplacementMap in2="turb" in="SourceGraphic" scale="15" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Top Navigation */}
      <header className="glass-nav shadow-sm border-b border-white/10 relative z-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <div className="flex justify-between h-16 items-center">
              <Link href="/pharmacy/dashboard" className="flex items-center">
                <CuroGenixLogo size="md" />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 glass-button border-0 bg-white/5 hover:bg-white/10 text-white">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="hidden sm:block text-white">{pharmacyName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card border-0">
                  <DropdownMenuItem className="text-white hover:bg-white/10">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="text-white hover:bg-white/10" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* Tab Navigation removed */}
          </div>
        </div>
      </header>

      {/* Main Content - full width, no sidebar or tabs */}
      <main className="flex-1 pt-8 relative z-10">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
