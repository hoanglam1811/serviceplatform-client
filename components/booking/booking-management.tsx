"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, Star, MessageSquare, CheckCircle, XCircle, User } from "lucide-react"
import type { Booking } from "@/types/booking"
import { useAuth } from "@/contexts/auth-context"
import { getBookingByProviderId, getBookingByUserId, updateBookingStatus } from "@/services/bookingService"
import dayjs from "dayjs"
import { Input, notification } from "antd"

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
  }

  const handleDeclineBooking = (bookingId: string) => {
    console.log("Declining booking:", bookingId)
  }

  const handleCompleteBooking = (bookingId: string) => {
    console.log("Completing booking:", bookingId)
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
    try {
      if (!user) return
      const [bookings] = await Promise.all([
        getBookingByProviderId(user.id),
      ])
      setBookings(bookings.data)
    }
    catch (err) {
      console.log(err)
    }
    finally {
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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false)
  const [declineReason, setDeclineReason] = useState("")
  const [currentBooking, setCurrentBooking] = useState(booking)
  const [agreeConfirmTerms, setAgreeConfirmTerms] = useState(false)
  const [agreeDeclineTerms, setAgreeDeclineTerms] = useState(false)

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

  const handleConfirm = async () => {
    try {
      await updateBookingStatus(currentBooking.id, "confirmed")
      setCurrentBooking({ ...currentBooking, status: "confirmed" }) // cập nhật tại chỗ
      notification.success({
        message: "Booking Confirmed",
        description: "You have successfully confirmed this booking.",
      })
      setIsConfirmModalOpen(false)
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to confirm booking.",
      })
    }
  }

  // ❌ Decline booking
  const handleDecline = async () => {
    try {
      await updateBookingStatus(currentBooking.id, "cancelled")
      setCurrentBooking({ ...currentBooking, status: "cancelled" })
      notification.success({
        message: "Booking Declined",
        description: declineReason || "You have declined this booking.",
      })
      setIsDeclineModalOpen(false)
      setDeclineReason("")
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to decline booking.",
      })
    }
  }

  return (
    <Card className="relative overflow-hidden border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all bg-white">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900">
              {booking.service.name}
            </h3>
            <p className="text-sm text-gray-500">
              {userRole === "provider"
                ? `Customer: ${booking.user?.fullName}`
                : `Provider: ${user?.name}`}
            </p>
          </div>
          <div>
            <Badge
              variant="outline"
              className={`rounded-full px-3 py-1 text-xs font-medium shadow-sm ${getStatusColor(
                booking.status
              )}`}
            >
              {booking.status.replace("-", " ")}
            </Badge>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Info grid */}
        {/* Info grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-400" /> Start
            </p>
            <p className="text-gray-700 font-medium truncate">
              {booking.startTime.split("T").join(" ")}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-400" /> End
            </p>
            <p className="text-gray-700 font-medium truncate">
              {booking.endTime.split("T").join(" ")}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-0.5">Price</p>
            <p className="font-semibold text-emerald-600">
              {booking.service.discountPrice.toLocaleString()} ₫
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-0.5">Payment</p>
            <p
              className={`font-medium ${booking.paymentStatus === "Paid"
                ? "text-green-600"
                : "text-amber-600"
                }`}
            >
              {booking.paymentStatus}
            </p>
          </div>
        </div>


        {/* Note */}
        {booking.note && (
          <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl text-sm text-gray-700">
            <p>
              <span className="font-medium">Note:</span> {booking.note}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg hover:border-gray-300"
            onClick={onViewDetails}
          >
            <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
            View Details
          </Button>

          {currentBooking.status === "Pending" && userRole === "provider" && (
            <div className="flex gap-3">
              <Button
                size="sm"
                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                onClick={() => setIsConfirmModalOpen(true)}
              >
                Confirm
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => setIsDeclineModalOpen(true)}
              >
                Decline
              </Button>
            </div>
          )}

          {booking.status.toLowerCase() === "confirmed" &&
            userRole.toLowerCase() === "provider" && (
              <Button
                size="sm"
                className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                onClick={onComplete}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            )}
        </div>

        <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Booking</DialogTitle>
              <DialogDescription>
                Vui lòng đọc kỹ điều khoản trước khi xác nhận:
                <ul className="list-disc ml-5 mt-2 text-sm text-gray-600 space-y-1">
                  <li>Việc xác nhận đồng nghĩa bạn cam kết cung cấp dịch vụ đúng thời gian đã đặt.</li>
                  <li>Hủy sau khi đã xác nhận có thể ảnh hưởng đến uy tín và bị phạt.</li>
                  <li>Khách hàng có quyền đánh giá chất lượng dịch vụ sau khi hoàn tất.</li>
                </ul>
              </DialogDescription>
            </DialogHeader>

            {/* Checkbox đồng ý */}
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="confirmTerms"
                checked={agreeConfirmTerms}
                onChange={(e) => setAgreeConfirmTerms(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="confirmTerms" className="text-sm text-gray-700">
                Tôi đồng ý với các điều khoản & nội quy
              </label>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!agreeConfirmTerms}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeclineModalOpen} onOpenChange={setIsDeclineModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Decline Booking</DialogTitle>
              <DialogDescription>
                Vui lòng nhập lý do từ chối (nếu có) và đồng ý với điều khoản:
                <ul className="list-disc ml-5 mt-2 text-sm text-gray-600 space-y-1">
                  <li>Từ chối phải có lý do hợp lý và thông báo sớm cho khách hàng.</li>
                  <li>Việc từ chối nhiều lần có thể ảnh hưởng đến điểm đánh giá của bạn.</li>
                </ul>
              </DialogDescription>
            </DialogHeader>

            <Input.TextArea
              rows={3}
              placeholder="Reason for decline..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
            />

            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="declineTerms"
                checked={agreeDeclineTerms}
                onChange={(e) => setAgreeDeclineTerms(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="declineTerms" className="text-sm text-gray-700">
                Tôi đồng ý với các điều khoản & nội quy khi từ chối
              </label>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDeclineModalOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white"
                onClick={handleDecline}
                disabled={!agreeDeclineTerms}
              >
                Decline
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>

      {/* Accent bar (status color) */}
      <div
        className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${getStatusColor(
          booking.status
        )}`}
      />
    </Card>
  )
}

interface BookingDetailsModalProps {
  booking: Booking
  onClose: () => void
  userRole: "provider" | "customer"
}

function BookingDetailsModal({ booking, onClose, userRole }: BookingDetailsModalProps) {
  const fixedRating = 4
  const fixedReview = "Good service, will book again!"

  const { user } = useAuth();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Booking Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Service + Schedule */}
          <div className="grid grid-cols-2 gap-6">
            {/* Service Info */}
            <div>
              <h4 className="font-semibold mb-3">Service Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Service</span>
                  <span className="font-medium text-gray-800">{booking.service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Price</span>
                  <span className="font-semibold text-emerald-600">
                    {booking.service.discountPrice.toLocaleString()} ₫
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="font-medium">{booking.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment</span>
                  <span
                    className={`font-medium ${booking.paymentStatus === "Paid" ? "text-green-600" : "text-amber-600"
                      }`}
                  >
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <h4 className="font-semibold mb-3">Schedule</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{dayjs(booking.startTime).format("DD/MM/YYYY")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium">{dayjs(booking.startTime).format("HH:mm")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Booked</span>
                  <span className="font-medium">{dayjs(booking.createdAt).format("DD/MM/YYYY HH:mm")}</span>
                </div>
                {booking.endTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Completed</span>
                    <span className="font-medium">{dayjs(booking.endTime).format("DD/MM/YYYY HH:mm")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Customer/Provider Info */}
          <div>
            <h4 className="font-semibold mb-2">
              {userRole === "provider" ? "Customer" : "Provider"} Information
            </h4>
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <User className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">
                {userRole === "provider" ? booking.userId : booking.service.userId}
              </span>
            </div>
            <h4 className="font-semibold mb-2">{userRole === "provider" ? "Customer" : "Provider"} Information</h4>
            <p className="text-sm">
              <strong>Name:</strong> {userRole === "provider" ? user?.name : booking.user?.fullName}
            </p>
          </div>

          {/* Additional Notes */}
          {booking.note && (
            <div>
              <h4 className="font-semibold mb-2">Additional Notes</h4>
              <p className="text-sm bg-gray-50 p-3 rounded-lg">{booking.note}</p>
            </div>
          )}

          {booking.status.toLowerCase() === "completed" && (
            <div>
              <h4 className="font-semibold mb-2">Rating & Review</h4>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < fixedRating ? "fill-current" : ""}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({fixedRating}/5)</span>
              </div>
              <p className="text-sm bg-gray-50 p-3 rounded-lg">{fixedReview}</p>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  )
}
