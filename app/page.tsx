"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProviderDashboard } from "@/components/provider/provider-dashboard"
import { CustomerDashboard } from "@/components/customer/customer-dashboard"

export default function HomePage() {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const { user, isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {user.role === "provider" ? <ProviderDashboard /> : <CustomerDashboard />}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ServiceHub</h1>
          <p className="text-gray-600">Connect service providers with customers</p>
        </div>

        {isLoginMode ? (
          <LoginForm onToggleMode={() => setIsLoginMode(false)} />
        ) : (
          <SignupForm onToggleMode={() => setIsLoginMode(true)} />
        )}
      </div>
    </div>
  )
}
