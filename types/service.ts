export interface Service {
  id: string
  providerId: string
  title: string
  description: string
  category: string
  price: number
  duration: number
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
  // --- Freelancer / Online Services ---
  { id: "design", name: "Design & Creative", icon: "🎨" },
  { id: "development", name: "Web Development", icon: "💻" },
  { id: "writing", name: "Writing & Content", icon: "✍️" },
  { id: "marketing", name: "Digital Marketing", icon: "📈" },
  { id: "consulting", name: "Business Consulting", icon: "💼" },
  { id: "photography", name: "Photography & Videography", icon: "📸" },
  { id: "music", name: "Music & Audio", icon: "🎵" },
  { id: "fitness", name: "Health & Fitness Coaching", icon: "💪" },
  { id: "virtual_assistant", name: "Virtual Assistance", icon: "🧑‍💻" },

  // --- Home & Lifestyle Services ---
  { id: "cleaning", name: "Home Cleaning", icon: "🧹" },
  { id: "plumbing", name: "Plumbing Services", icon: "🚰" },
  { id: "electrician", name: "Electrical Services", icon: "💡" },
  { id: "appliance", name: "Appliance Repair", icon: "🔧" },
  { id: "pet_care", name: "Pet Care & Grooming", icon: "🐶" },
  { id: "moving", name: "Moving & Delivery", icon: "🚚" },
  { id: "gardening", name: "Gardening & Landscaping", icon: "🌱" },
  { id: "painting", name: "Painting & Renovation", icon: "🎨" },
  { id: "babysitting", name: "Babysitting & Child Care", icon: "🍼" },
  { id: "elderly_care", name: "Elderly Care", icon: "❤️" },
  { id: "carpentry", name: "Carpentry & Furniture Repair", icon: "🪚" },
  { id: "locksmith", name: "Locksmith", icon: "🔑" },
  { id: "pest_control", name: "Pest Control", icon: "🐜" },

  // --- Personal Services ---
  { id: "beauty", name: "Beauty & Salon", icon: "💅" },
  { id: "massage", name: "Massage & Spa", icon: "💆" },
  { id: "tutoring", name: "Tutoring & Education", icon: "📚" },
  { id: "event", name: "Event Planning", icon: "🎉" },
  { id: "photobooth", name: "Photo Booth & Party Services", icon: "🤳" },
  { id: "car_wash", name: "Car Wash & Detailing", icon: "🚗" },
  { id: "driver", name: "Private Driver", icon: "🛺" },
  { id: "laundry", name: "Laundry & Dry Cleaning", icon: "👕" },
]
