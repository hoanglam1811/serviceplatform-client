"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Star, ShoppingBag } from "lucide-react"
import { ServiceBrowser } from "./service-browser"
import { BookingFlow } from "../booking/booking-flow"
import type { Service, ServiceDTO } from "@/types/service"
import type { Booking } from "@/types/booking"
import { useAuth } from "@/contexts/auth-context"
import UserProfile from "@/app/user-profile/page"

// Mock booking data
const mockBookings: Booking[] = [
  {
    id: "1",
    serviceId: "1",
    customerId: "2",
    providerId: "1",
    serviceTitle: "Professional Logo Design",
    providerName: "John Provider",
    customerName: "Jane Customer",
    status: "completed",
    bookingDate: new Date("2024-01-15"),
    scheduledDate: new Date("2024-01-18"),
    scheduledTime: "10:00",
    completionDate: new Date("2024-01-18"),
    price: 150,
    paymentStatus: "paid",
    rating: 5,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "2",
    serviceId: "3",
    customerId: "2",
    providerId: "3",
    serviceTitle: "Content Writing & Copywriting",
    providerName: "Jane Writer",
    customerName: "Jane Customer",
    status: "in-progress",
    bookingDate: new Date("2024-01-20"),
    scheduledDate: new Date("2024-01-22"),
    scheduledTime: "14:00",
    price: 75,
    paymentStatus: "paid",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
]

export function CustomerDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const [selectedService, setSelectedService] = useState<ServiceDTO | null>(null)
  const [showBookingFlow, setShowBookingFlow] = useState(false)

  const handleBookService = (service: ServiceDTO) => {
    setSelectedService(service)
    setShowBookingFlow(true)
  }

  const handleBookingComplete = (bookingId: string) => {
    console.log("Booking completed:", bookingId)
  }

  const completedBookings = bookings.filter((booking) => booking.status === "completed")
  const activeBookings = bookings.filter((booking) => booking.status !== "completed")
  const totalSpent = bookings.reduce((sum, booking) => sum + booking.price, 0)

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
            <p className="text-xs text-muted-foreground">{activeBookings.length} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedBookings.length}</div>
            <p className="text-xs text-muted-foreground">Services completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent}</div>
            <p className="text-xs text-muted-foreground">Across all services</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Your service ratings</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">Browse Services</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <ServiceBrowser onBookService={handleBookService} />
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No bookings yet. Browse services to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{booking.serviceTitle}</h4>
                          <p className="text-sm text-gray-600">by {booking.providerName}</p>
                        </div>
                        <Badge
                          variant={
                            booking.status === "completed"
                              ? "default"
                              : booking.status === "in-progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {booking.status.replace("-", " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Scheduled: {booking.scheduledDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{booking.scheduledTime}</span>
                        </div>
                        <div className="font-semibold text-green-600">${booking.price}</div>
                      </div>
                      {booking.status === "completed" && booking.rating && (
                        <div className="flex items-center gap-1 text-sm">
                          <span>Your rating:</span>
                          <div className="flex items-center gap-1 text-yellow-600">
                            {[...Array(booking.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-current" />
                            ))}
                          </div>
                        </div>
                      )}
                      {booking.status === "in-progress" && (
                        <Button size="sm" variant="outline">
                          View Progress
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No favorites yet. Heart services you love to save them here!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <UserProfile />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Booking Flow Modal */}
      {selectedService && (
        <BookingFlow
          service={selectedService}
          isOpen={showBookingFlow}
          onClose={() => {
            setShowBookingFlow(false)
            setSelectedService(null)
          }}
          onBookingComplete={handleBookingComplete}
        />
      )}
    </div>
  )
}
