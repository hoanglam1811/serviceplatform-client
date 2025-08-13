export interface Service {
  id: string
  providerId: string
  title: string
  description: string
  category: string
  price: number
  duration: number // in minutes
  images: string[]
  tags: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ServiceCategory {
  id: string
  name: string
  icon: string
}

export const serviceCategories: ServiceCategory[] = [
  { id: "design", name: "Design & Creative", icon: "🎨" },
  { id: "development", name: "Web Development", icon: "💻" },
  { id: "writing", name: "Writing & Content", icon: "✍️" },
  { id: "marketing", name: "Digital Marketing", icon: "📈" },
  { id: "consulting", name: "Business Consulting", icon: "💼" },
  { id: "photography", name: "Photography", icon: "📸" },
  { id: "music", name: "Music & Audio", icon: "🎵" },
  { id: "fitness", name: "Health & Fitness", icon: "💪" },
]
