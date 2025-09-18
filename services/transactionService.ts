import api from "./api"
import { TransactionDTO, CreateTransactionDTO, UpdateTransactionDTO } from "@/types/transaction"

// CREATE
export const createTransaction = async (dto: CreateTransactionDTO): Promise<TransactionDTO> => {
    const res = await api.post("/transaction", dto)
    return res.data.data
}

// READ - Get all
export const getAllTransactions = async (): Promise<TransactionDTO[]> => {
    const res = await api.get("/transaction")
    return res.data.data
}

// READ - Get by Id
export const getTransactionById = async (id: string): Promise<TransactionDTO> => {
    const res = await api.get(`/transaction/${id}`)
    return res.data.data
}

// READ - Get by Wallet Id
export const getTransactionsByWalletId = async (walletId: string): Promise<TransactionDTO[]> => {
    const res = await api.get(`/transaction/by-wallet/${walletId}`)
    return res.data.data
}

// READ - Get by User Id
export const getTransactionsByUserId = async (userId: string): Promise<TransactionDTO[]> => {
    const res = await api.get(`/transaction/by-user/${userId}`)
    return res.data.data
}

// UPDATE
export const updateTransaction = async (id: string, dto: UpdateTransactionDTO): Promise<TransactionDTO> => {
    const res = await api.put(`/transaction/${id}`, dto)
    return res.data.data
}

// DELETE
export const deleteTransaction = async (id: string): Promise<TransactionDTO> => {
    const res = await api.delete(`/transaction/${id}`)
    return res.data.data
}
