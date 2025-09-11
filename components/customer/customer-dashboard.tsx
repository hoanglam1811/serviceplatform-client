"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Star, ShoppingBag, Plus, ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react"
import { ServiceBrowser } from "./service-browser"
import { BookingFlow } from "../booking/booking-flow"
import type { Service, ServiceDTO } from "@/types/service"
import type { Booking } from "@/types/booking"
import { useAuth } from "@/contexts/auth-context"
import CustomerProfile from "@/app/customer-profile/page"
import { getBookingByUserId } from "@/services/bookingService"
import { notification } from "antd"
import { createWallet, getWalletByUserId } from "@/services/walletService"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"


export function CustomerDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showBookingFlow, setShowBookingFlow] = useState(false)
  const [wallet, setWallet] = useState<any | null>(null)
  const [openConfirm, setOpenConfirm] = useState(false)

  const handleBookService = (service: Service) => {
    setSelectedService(service)
    setShowBookingFlow(true)
  }

  const handleBookingComplete = (bookingId: string) => {
    console.log("Booking completed:", bookingId)
  }

  const fetchWallet = async () => {
    try {
      const res = await getWalletByUserId(user?.id || "")
      setWallet(res.data)
    } catch (err) {
      console.log("No wallet yet")
      setWallet(null)
    }
  }

  const handleCreateWallet = async () => {
    try {
      const res = await createWallet({
        userId: user?.id,
        balance: 0,
      })
      setWallet(res.data)
      notification.success({
        message: "Success",
        description: "Wallet created successfully!",
      })
    } catch (err) {
      notification.error({
        message: "Error",
        description: "Failed to create wallet",
      })
    }
  }

  const completedBookings = bookings.filter((booking) => booking.status === "completed")
  const activeBookings = bookings.filter((booking) => booking.status !== "completed")
  const totalSpent = bookings.reduce((sum, booking) => sum + booking.service.discountPrice, 0)

  const fetchData = async () => {
    try {
      if (!user) return
      const [bookings] = await Promise.all([
        getBookingByUserId(user.id),
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
    if (user?.id) {
      fetchData()
      fetchWallet()
    }
  }, [user?.id])

  return (
    <div className="space-y-6">
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
          <TabsTrigger value="wallet">My Wallet</TabsTrigger>
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
                          <h4 className="font-semibold">{booking.service.name}</h4>
                          <p className="text-sm text-gray-600">by {booking.user?.fullName}</p>
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
                          <span>Scheduled: {booking.startTime.split("T").join(" ")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{booking.endTime.split("T").join(" ")}</span>
                        </div>
                        <div className="font-semibold text-green-600">${booking.service.discountPrice}</div>
                      </div>
                      {booking.status.toLowerCase() === "completed" && 5 && (
                        <div className="flex items-center gap-1 text-sm">
                          <span>Your rating:</span>
                          <div className="flex items-center gap-1 text-yellow-600">
                            {[...Array(5)].map((_, i) => (
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
              <CustomerProfile />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
          {/* Balance Card */}
          <Card className="border border-gray-200 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-gray-700">
                My Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              {wallet ? (
                <div className="text-center space-y-6">
                  <h3 className="text-4xl font-bold tracking-tight text-gray-900">
                    {wallet.balance.toLocaleString()} ₫
                  </h3>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" className="rounded-xl">
                      Nạp tiền
                    </Button>
                    <Button variant="outline" className="rounded-xl">
                      Rút tiền
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-gray-500 text-sm">
                    Bạn chưa có ví. Hãy tạo ví để bắt đầu quản lý số dư của bạn.
                  </p>
                  <Button
                    className="rounded-xl"
                    onClick={() => setOpenConfirm(true)}
                  >
                    <Wallet className="h-4 w-4 mr-2" /> Tạo ví
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Modal xác nhận tạo ví */}
          <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
            <DialogContent className="sm:max-w-md rounded-2xl shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Xác nhận tạo ví
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-gray-600">
                <p>Bạn có chắc chắn muốn tạo ví mới không?</p>
                <p>Số dư khởi tạo: <span className="font-semibold text-gray-900">0 ₫</span></p>
              </div>
              <DialogFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOpenConfirm(false)}
                  className="rounded-xl"
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => {
                    handleCreateWallet()
                    setOpenConfirm(false)
                  }}
                  className="rounded-xl bg-blue-600 text-white"
                >
                  Xác nhận
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
          fetchData={fetchData}
          onBookingComplete={handleBookingComplete}
        />
      )}
    </div>
  )
}
