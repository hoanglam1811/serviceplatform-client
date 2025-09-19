export interface ProviderProfileDTO {
  id?: string
  userId?: string
  companyName?: string
  type?: string 
  address?: string
  taxCode?: string
  businessPhone?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateProviderProfileDTO {
  userId?: string
  companyName?: string | null
  type?: "Individual" | "Company"
  address?: string | null
  taxCode?: string | null
  businessPhone?: string
}

export interface UpdateProviderProfileDTO {
  id: string
  companyName?: string | null
  type?: "Individual" | "Company"
  address?: string | null
  taxCode?: string | null
  businessPhone?: string
}
