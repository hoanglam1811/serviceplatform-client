export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  isRead: boolean
}

export interface ChatConversation {
  id: string
  participants: string[]
  lastMessage?: Message
  lastActivity: Date
}

export interface ChatUser {
  id: string
  name: string
  role: "provider" | "customer"
  avatar?: string
  isOnline: boolean
}

export interface CreateChatDTO {
  userId: string;
  serviceId: string;
  senderId: string;
	receiverId: string;
  message: string;
  status: string;
}

export interface UpdateChatDTO {
  id: string;
	message: string;
	status: string;
}
