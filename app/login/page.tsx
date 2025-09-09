"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { Navbar } from "@/components/navigation/navbar"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import { notification } from "antd"

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  console.log(user)

  useEffect(() => {
    if (isAuthenticated && user && user.status === "Pending") {
      router.push("/login")
      notification.error({
        message: "Error",
        description: "Failed to login. You have to wait for admin's approval",
      })
    }
  }, [isAuthenticated, user, router])

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLoginMode ? "Welcome Back" : "Join ServiceHub"}
            </h1>
            <p className="text-gray-600">
              {isLoginMode ? "Sign in to your account to continue" : "Create your account to get started"}
            </p>
          </div>

          {isLoginMode ? (
            <LoginForm onToggleMode={() => setIsLoginMode(false)} />
          ) : (
            <SignupForm onToggleMode={() => setIsLoginMode(true)} />
          )}
        </div>
      </div>
    </div>
  )
}
