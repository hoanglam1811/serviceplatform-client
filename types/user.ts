export interface User {
  id: string
  email: string
  name: string
  role: "provider" | "customer"
  avatar?: string
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}
