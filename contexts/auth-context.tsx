"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, AuthState, RegisterDTO } from "@/types/user"
import { loginCustomer, logoutAPI, registerCustomer } from "@/services/authService"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  signup: (
    email: string,
    password: string,
    fullName: string,
    username: string,
    phoneNumber: string,
    nationalId: File[],
    gender: string,
    role: "Provider" | "Customer") => Promise<any>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
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
    try {
      const res = await loginCustomer(email, password)

      if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data))
        setAuthState({
          user: res.data,
          isLoading: false,
          isAuthenticated: true,
        })
        return true
      }
    }
    catch (err) {
      return false;
    }
    finally {

    }
    return false
  }

  const signup = async (
    email: string,
    password: string,
    fullName: string,
    username: string,
    phoneNumber: string,
    nationalId: File[],
    gender: string,
    role: "Provider" | "Customer",
  ): Promise<any> => {
    try {
      const newUser: RegisterDTO = {
        email,
        username,
        fullName,
        password,
        status: "Pending",
        phoneNumber,
        gender,
        nationalId,
        role,
      }
      const res = await registerCustomer(newUser);
      const userData = res.data;
      return userData
    }
    catch (err) {
      console.log(err);
      return false
    }
    finally {

    }
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
