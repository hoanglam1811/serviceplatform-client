export interface TransactionDTO {
  id: string
  walletId: string
  amount?: number
  currency?: string
  status?: string
  createdAt?: string
  completedAt?: string
}

export interface CreateTransactionDTO {
  walletId: string
  amount?: number
  currency?: string
  status?: string
}

export interface UpdateTransactionDTO {
  id: string
  amount?: number
  currency?: string
  status?: string
  completedAt?: string
}
