"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, Star, MessageSquare, CheckCircle, XCircle } from "lucide-react"
import type { Booking } from "@/types/booking"
import { useAuth } from "@/contexts/auth-context"
import { getBookingByProviderId, getBookingByUserId } from "@/services/bookingService"

interface BookingManagementProps {
  userRole: "provider" | "customer"
}

export function BookingManagement({ userRole }: BookingManagementProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [responseMessage, setResponseMessage] = useState("")

  const pendingBookings = bookings.filter((b) => b.status.toLowerCase() === "pending")
  const confirmedBookings = bookings.filter((b) => b.status.toLowerCase() === "confirmed")
  const completedBookings = bookings.filter((b) => b.status.toLowerCase() === "completed")
  const { user } = useAuth()

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

  const fetchData = async () => {
    try{
      if(!user) return
      const [bookings]= await Promise.all([
        getBookingByProviderId(user.id),
      ]) 
      setBookings(bookings.data)
    }
    catch(err){
      console.log(err)
    }
    finally{

    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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
  const { user } = useAuth()
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
            <h3 className="font-semibold text-lg mb-1">{booking.service.name}</h3>
            <p className="text-gray-600">
              {userRole === "provider" ? `Customer: ${booking.user?.fullName}` : `Provider: ${user?.name}`}
            </p>
          </div>
          <Badge className={getStatusColor(booking.status)}>{booking.status.replace("-", " ")}</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{booking.startTime.split("T").join(" ")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{booking.endTime.split("T").join(" ")}</span>
          </div>
          <div className="font-semibold text-green-600">${booking.service.discountPrice}</div>
          <div className="text-gray-600">Payment: {booking.paymentStatus}</div>
        </div>

        {booking.note && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm">
              <strong>Note:</strong> {booking.note}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            <MessageSquare className="h-4 w-4 mr-2" />
            View Details
          </Button>

          {booking.status.toLowerCase() === "pending" && userRole.toLowerCase() === "provider" && (
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

          {booking.status.toLowerCase() === "confirmed" && userRole.toLowerCase() === "provider" && (
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
                <strong>Service:</strong> {booking.service.name}
              </p>
              <p className="text-sm mb-1">
                <strong>Price:</strong> ${booking.service.discountPrice}
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
                <strong>Date:</strong> {booking?.startTime.split("T")[0]}
              </p>
              <p className="text-sm mb-1">
                <strong>Time:</strong> {booking?.startTime.split("T")[1]}
              </p>
              <p className="text-sm mb-1">
                <strong>Booked:</strong> {booking?.createdAt?.toLocaleDateString()}
              </p>
              {booking.endTime && (
                <p className="text-sm">
                  <strong>Completed:</strong> {booking.endTime.split("T").join(" ")}
                </p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">{userRole === "provider" ? "Customer" : "Provider"} Information</h4>
            <p className="text-sm">
              <strong>Name:</strong> {userRole === "provider" ? booking.userId : booking.service.userId}
            </p>
          </div>

          {/*booking.note && (
            <div>
              <h4 className="font-semibold mb-2">Requirements</h4>
              <p className="text-sm bg-gray-50 p-3 rounded-lg">{booking.note}</p>
            </div>
          )*/}

          {booking.note && (
            <div>
              <h4 className="font-semibold mb-2">Additional Notes</h4>
              <p className="text-sm bg-gray-50 p-3 rounded-lg">{booking.note}</p>
            </div>
          )}

          {booking.status.toLowerCase() === "completed" && 5 && (
            <div>
              <h4 className="font-semibold mb-2">Rating & Review</h4>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 text-yellow-600">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm">({5}/5)</span>
              </div>
              {<p className="text-sm bg-gray-50 p-3 rounded-lg">{"Good service"}</p>}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
