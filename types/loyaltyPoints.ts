export interface LoyaltyPointDTO {
  id: string
  userId: string
  points?: number
  updatedAt?: string
}

export interface CreateLoyaltyPointDTO {
  userId: string
  points?: number
}

export interface UpdateLoyaltyPointDTO {
  id: string
  userId: string
  points?: number
}
