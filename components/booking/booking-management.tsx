"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, Star, MessageSquare, CheckCircle, XCircle } from "lucide-react"
import type { Booking } from "@/types/booking"

// Mock bookings for provider
const mockProviderBookings: Booking[] = [
  {
    id: "1",
    serviceId: "1",
    customerId: "2",
    providerId: "1",
    serviceTitle: "Professional Logo Design",
    providerName: "John Provider",
    customerName: "Jane Customer",
    status: "confirmed",
    bookingDate: new Date("2024-01-20"),
    scheduledDate: new Date("2024-01-25"),
    scheduledTime: "10:00",
    price: 150,
    paymentStatus: "paid",
    requirements: "Need a modern logo for tech startup, prefer blue colors",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    serviceId: "2",
    customerId: "3",
    providerId: "1",
    serviceTitle: "Custom Website Development",
    providerName: "John Provider",
    customerName: "Mike Wilson",
    status: "pending",
    bookingDate: new Date("2024-01-21"),
    scheduledDate: new Date("2024-01-28"),
    scheduledTime: "14:00",
    price: 800,
    paymentStatus: "pending",
    requirements: "E-commerce website with payment integration",
    createdAt: new Date("2024-01-21"),
    updatedAt: new Date("2024-01-21"),
  },
]

interface BookingManagementProps {
  userRole: "provider" | "customer"
}

export function BookingManagement({ userRole }: BookingManagementProps) {
  const [bookings] = useState<Booking[]>(mockProviderBookings)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [responseMessage, setResponseMessage] = useState("")

  const pendingBookings = bookings.filter((b) => b.status === "pending")
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed")
  const completedBookings = bookings.filter((b) => b.status === "completed")

  const handleAcceptBooking = (bookingId: string) => {
    console.log("Accepting booking:", bookingId)
    // Update booking status logic here
  }

  const handleDeclineBooking = (bookingId: string) => {
    console.log("Declining booking:", bookingId)
    // Update booking status logic here
  }

  const handleCompleteBooking = (bookingId: string) => {
    console.log("Completing booking:", bookingId)
    // Update booking status logic here
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{userRole === "provider" ? "Manage Bookings" : "My Bookings"}</h2>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({confirmedBookings.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">No pending bookings</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userRole={userRole}
                  onViewDetails={() => setSelectedBooking(booking)}
                  onAccept={() => handleAcceptBooking(booking.id)}
                  onDecline={() => handleDeclineBooking(booking.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          {confirmedBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">No confirmed bookings</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {confirmedBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userRole={userRole}
                  onViewDetails={() => setSelectedBooking(booking)}
                  onComplete={() => handleCompleteBooking(booking.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Star className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">No completed bookings</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {completedBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userRole={userRole}
                  onViewDetails={() => setSelectedBooking(booking)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} userRole={userRole} />
      )}
    </div>
  )
}

interface BookingCardProps {
  booking: Booking
  userRole: "provider" | "customer"
  onViewDetails: () => void
  onAccept?: () => void
  onDecline?: () => void
  onComplete?: () => void
}

function BookingCard({ booking, userRole, onViewDetails, onAccept, onDecline, onComplete }: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{booking.serviceTitle}</h3>
            <p className="text-gray-600">
              {userRole === "provider" ? `Customer: ${booking.customerName}` : `Provider: ${booking.providerName}`}
            </p>
          </div>
          <Badge className={getStatusColor(booking.status)}>{booking.status.replace("-", " ")}</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{booking.scheduledDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{booking.scheduledTime}</span>
          </div>
          <div className="font-semibold text-green-600">${booking.price}</div>
          <div className="text-gray-600">Payment: {booking.paymentStatus}</div>
        </div>

        {booking.requirements && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm">
              <strong>Requirements:</strong> {booking.requirements}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            <MessageSquare className="h-4 w-4 mr-2" />
            View Details
          </Button>

          {booking.status === "pending" && userRole === "provider" && (
            <>
              <Button size="sm" onClick={onAccept}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept
              </Button>
              <Button variant="outline" size="sm" onClick={onDecline}>
                <XCircle className="h-4 w-4 mr-2" />
                Decline
              </Button>
            </>
          )}

          {booking.status === "confirmed" && userRole === "provider" && (
            <Button size="sm" onClick={onComplete}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface BookingDetailsModalProps {
  booking: Booking
  onClose: () => void
  userRole: "provider" | "customer"
}

function BookingDetailsModal({ booking, onClose, userRole }: BookingDetailsModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Service Information</h4>
              <p className="text-sm mb-1">
                <strong>Service:</strong> {booking.serviceTitle}
              </p>
              <p className="text-sm mb-1">
                <strong>Price:</strong> ${booking.price}
              </p>
              <p className="text-sm mb-1">
                <strong>Status:</strong> {booking.status}
              </p>
              <p className="text-sm">
                <strong>Payment:</strong> {booking.paymentStatus}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Schedule</h4>
              <p className="text-sm mb-1">
                <strong>Date:</strong> {booking.scheduledDate.toLocaleDateString()}
              </p>
              <p className="text-sm mb-1">
                <strong>Time:</strong> {booking.scheduledTime}
              </p>
              <p className="text-sm mb-1">
                <strong>Booked:</strong> {booking.bookingDate.toLocaleDateString()}
              </p>
              {booking.completionDate && (
                <p className="text-sm">
                  <strong>Completed:</strong> {booking.completionDate.toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">{userRole === "provider" ? "Customer" : "Provider"} Information</h4>
            <p className="text-sm">
              <strong>Name:</strong> {userRole === "provider" ? booking.customerName : booking.providerName}
            </p>
          </div>

          {booking.requirements && (
            <div>
              <h4 className="font-semibold mb-2">Requirements</h4>
              <p className="text-sm bg-gray-50 p-3 rounded-lg">{booking.requirements}</p>
            </div>
          )}

          {booking.notes && (
            <div>
              <h4 className="font-semibold mb-2">Additional Notes</h4>
              <p className="text-sm bg-gray-50 p-3 rounded-lg">{booking.notes}</p>
            </div>
          )}

          {booking.status === "completed" && booking.rating && (
            <div>
              <h4 className="font-semibold mb-2">Rating & Review</h4>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 text-yellow-600">
                  {[...Array(booking.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm">({booking.rating}/5)</span>
              </div>
              {booking.review && <p className="text-sm bg-gray-50 p-3 rounded-lg">{booking.review}</p>}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
