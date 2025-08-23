"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, AuthState } from "@/types/user"
import { loginCustomer, logoutAPI } from "@/services/authService"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string, role: "provider" | "customer") => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    email: "provider@example.com",
    name: "John Provider",
    role: "provider",
    createdAt: new Date(),
  },
  {
    id: "2",
    email: "customer@example.com",
    name: "Jane Customer",
    role: "customer",
    createdAt: new Date(),
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try{
      const res = await loginCustomer(email, password)

      if(res.data){
        localStorage.setItem("user", JSON.stringify(res.data))
        setAuthState({
          user: res.data,
          isLoading: false,
          isAuthenticated: true,
        })
        return true
      }
    }
    catch(err){
      return false;
    }
    finally{

    }
    return false
  }

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: "provider" | "customer",
  ): Promise<boolean> => {
    // Mock signup logic
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      createdAt: new Date(),
    }

    mockUsers.push(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    setAuthState({
      user: newUser,
      isLoading: false,
      isAuthenticated: true,
    })
    return true
  }

  const logout = async () => {
    try {
      await logoutAPI()
    } catch (err) {
      console.error("Logout failed", err)
    }
    localStorage.removeItem("user")
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
