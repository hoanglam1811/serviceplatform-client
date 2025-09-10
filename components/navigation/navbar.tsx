"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { User, LogOut, MessageCircle } from "lucide-react"
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text"

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SH</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ServiceHub</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/about-us" className="flex items-center space-x-2">
              <AnimatedShinyText hover={true} className="inline-flex items-center justify-center px-4 py-1 transition ease-out text-lg">
                About Us
              </AnimatedShinyText >
            </Link>
            <Link href="/services" className="flex items-center space-x-2">
              <AnimatedShinyText hover={true} className="inline-flex items-center justify-center px-4 py-1 transition ease-out text-lg">
                Services
              </AnimatedShinyText >
            </Link>
            <Link href="/feedback" className="flex items-center space-x-2">
              <AnimatedShinyText hover={true} className="inline-flex items-center justify-center px-4 py-1 transition ease-out text-lg">
                Feedback
              </AnimatedShinyText >
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {user.status !== "Pending" &&
                  <Link href="/user-dashboard">
                    <Button variant="ghost" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                }

                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
