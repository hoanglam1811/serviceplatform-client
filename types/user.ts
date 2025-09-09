export interface User {
  id: string
  email: string
  name: string
  status: string
  role: "Provider" | "Customer"
  avatar?: string
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface RegisterDTO {
  username: string
  password: string
  fullName: string
  email: string
  phoneNumber: string
  gender: string
  nationalId?: File[]
  status: string
  role: string
}
