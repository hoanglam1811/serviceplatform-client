"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Search, MoreVertical, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { Message, ChatUser } from "@/types/chat"
import Link from "next/link"
import {
  HubConnection,
  HubConnectionBuilder,
} from "@microsoft/signalr";

// Mock data for demonstration
const mockUsers: ChatUser[] = [
  { id: "1", name: "John Provider", role: "provider", isOnline: true },
  { id: "2", name: "Jane Customer", role: "customer", isOnline: false },
  { id: "3", name: "Mike Designer", role: "provider", isOnline: true },
  { id: "4", name: "Sarah Client", role: "customer", isOnline: true },
]

export function ChatInterface() {
  const { user } = useAuth()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [connection, setConnection] = useState<HubConnection | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Get conversations for current user
  const conversations = mockUsers
    .filter((u) => u.id !== user?.id)
    .map((u) => ({
      id: u.id,
      user: u,
      lastMessage: messages
        .filter(
          (m) =>
            (m.senderId === user?.id && m.receiverId === u.id) || (m.senderId === u.id && m.receiverId === user?.id),
        )
        .sort((a, b) => b?.createdAt?.getTime() - a?.createdAt?.getTime())[0],
    }))
    .filter((c) => searchTerm === "" || c.user.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const selectedUser = conversations.find((c) => c.id === selectedConversation)?.user
  const conversationMessages = messages
    .filter(
      (m) =>
        selectedConversation &&
        ((m.senderId === user?.id && m.receiverId === selectedConversation) ||
          (m.senderId === selectedConversation && m.receiverId === user?.id)),
    )
    .sort((a, b) => a?.createdAt?.getTime() - b?.createdAt?.getTime())

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !user) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: selectedConversation,
      message: newMessage.trim(),
      createdAt: new Date(),
      status: "sent",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  useEffect(() => {
    const connect = new HubConnectionBuilder()
    .withUrl("http://localhost:5210/chathub", {
      withCredentials: true
    })
    .withAutomaticReconnect()
    .build();

    connect.on("ReceiveMessage", (sender: string, message: string) => {
      /*setMessages(prev => [...prev, { 
        id: Date.now().toString(),
        senderId: sender,
        receiverId: selectedConversation,
        message: message,
        createdAt: new Date(),
        status: "sent"
      }]);*/
    });

    connect
      .start()
      .then(() => {
        console.log("Connected to SignalR hub");
        setConnection(connect);
      })
      .catch(err => console.error("SignalR Connection Error: ", err));

    return () => {
      connect.stop();
    };
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <Link href="/user-dashboard" className="">
            <Button variant="ghost" className="font-semibold mb-3"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
          </Link>
          <h2 className="text-lg font-semibold mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedConversation === conversation.id ? "bg-muted" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {conversation.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.user.isOnline && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{conversation.user.name}</h3>
                    <Badge
                      variant={conversation.user.role === "provider" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {conversation.user.role}
                    </Badge>
                  </div>
                  {conversation.lastMessage && (
                    <p className="text-sm text-muted-foreground truncate mt-1">{conversation.lastMessage.message}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {selectedUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {selectedUser.isOnline && (
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedUser.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.isOnline ? "Online" : "Offline"} • {selectedUser.role}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversationMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === user?.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === user?.id ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderId === user?.id ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {message.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-card">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a conversation from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
