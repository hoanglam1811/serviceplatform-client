"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Star, ShoppingBag, Plus, ArrowDownCircle, ArrowUpCircle, Wallet, Receipt, CheckCircle2, XCircle, Loader2, Gift } from "lucide-react"
import { ServiceBrowser } from "./service-browser"
import { BookingFlow } from "../booking/booking-flow"
import type { Service, ServiceDTO } from "@/types/service"
import type { Booking } from "@/types/booking"
import { useAuth } from "@/contexts/auth-context"
import CustomerProfile from "@/app/customer-profile/page"
import { getBookingByUserId } from "@/services/bookingService"
import { Input, notification, Rate } from "antd"
import { createWallet, getWalletByUserId, updateWallet } from "@/services/walletService"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { ProviderProfileDialog } from "./provider-profile"
import { createReview } from "@/services/reviewService"
import { PayOSConfig, usePayOS } from "payos-checkout"
import { createPayOSLink } from "@/services/payOSService"
import { Label } from "../ui/label"
import { TransactionDTO } from "@/types/transaction"
import { createTransaction, getTransactionsByUserId } from "@/services/transactionService"
import { getPointsByUserId } from "@/services/loyaltyPointService"
import { useSearchParams } from "next/navigation"

export function CustomerDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showBookingFlow, setShowBookingFlow] = useState(false)
  const [wallet, setWallet] = useState<any | null>(null)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<any | null>(null)
  const [openProviderDialog, setOpenProviderDialog] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [openReview, setOpenReview] = useState(false)
  const [openPayOS, setOpenPayOS] = useState(false)
  const [openDeposit, setOpenDeposit] = useState(false)
  const [depositAmount, setDepositAmount] = useState(0)
  const [transactions, setTransactions] = useState<TransactionDTO[]>([])
  const [loadingTx, setLoadingTx] = useState(false)
  const [points, setPoints] = useState<number | null>(null)
  const [loadingPoints, setLoadingPoints] = useState(false)
  const [tabData, setTabData] = useState<string>("browse")

  const searchParams = useSearchParams();
  const tabName = searchParams.get("tab");

  const handleBookService = (service: Service) => {
    if(!user) {
      notification.error({
        message: "Không thể thực hiện",
        description: "Vui lòng đăng nhập trước khi đặt dịch vụ",
      })
      return
    }
    setSelectedService(service)
    setShowBookingFlow(true)
  }

  const handleDeposit = async () => {
    if (!wallet) return

    try {
      await updateWallet(wallet.id, {
        id: wallet.id,
        balance: wallet.balance + depositAmount,
      })

      await createTransaction({
        walletId: wallet.id,
        amount: depositAmount,
        currency: "VND",
        status: "Success",
        createdAt: new Date().toISOString(),
      })

      notification.success({
        message: "Thành công",
        description: "Nạp tiền thành công! Vui lòng tải lại trang để xem lịch sử giao dịch",
      })

      setOpenDeposit(false)
      await fetchWallet()
    } catch (err) {
      notification.error({
        message: "Thất bại",
        description: "Không thể nạp tiền, vui lòng thử lại.",
      })
    }
  }

  const handlePayment = async (handlePayOS: () => Promise<void>) => {
    try {
      setOpenPayOS(true)
      const res = await createPayOSLink(10000);
      const payOSConfig: PayOSConfig = {
        RETURN_URL: "http://localhost:3000/",
        ELEMENT_ID:
          "payos-container",
        CHECKOUT_URL: res.checkoutUrl,
        onSuccess: async (event: any) => {
          setOpenPayOS(false)
          await handlePayOS()
        },
        onExit: (event: any) => {
          setOpenPayOS(false)
        },
        onCancel: async (event: any) => {
          setOpenPayOS(false)
          await handlePayOS()
        },
      }

      const { open } = usePayOS(payOSConfig);
      open();
    }
    catch (error) {

    }
    finally {

    }
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

  const isWithin2Days = selectedBooking
    ? Date.now() - new Date(selectedBooking.endTime).getTime() <= 2 * 24 * 60 * 60 * 1000
    : false

  const handleSubmitReview = async () => {
    if (!rating) {
      notification.warning({ message: "Vui lòng chọn số sao để đánh giá" })
      return
    }
    setLoading(true)
    try {
      await createReview({
        bookingId: selectedBooking?.id ?? "",
        rating,
        comment,
        createdAt: new Date().toISOString(),
      })
      await fetchData()
      notification.success({
        message: "🎉 Gửi feedback thành công",
        description: "Cảm ơn bạn đã đánh giá dịch vụ!",
      })
      setOpenReview(false)
      setSelectedBooking(null)
    } catch (err) {
      notification.error({
        message: "❌ Thất bại",
        description: "Không thể gửi feedback, vui lòng thử lại.",
      })
    } finally {
      setLoading(false)
    }
  }

  const completedBookings = bookings.filter((booking) => booking.status === "Completed")
  const totalSpent = bookings.reduce(
    (sum, booking) => sum + (booking.service?.discountPrice ?? 0),
    0
  )

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

  useEffect(() => {
    if (!user?.id) return

    const fetchTransactions = async () => {
      try {
        setLoadingTx(true)
        const txs = await getTransactionsByUserId(user.id)
        setTransactions(txs)
      } catch (err) {
        console.error("Failed to fetch transactions:", err)
      } finally {
        setLoadingTx(false)
      }
    }

    fetchTransactions()
  }, [user?.id])

  useEffect(() => {
    if (user?.id) {
      setLoadingPoints(true)
      getPointsByUserId(user.id)
        .then(setPoints)
        .finally(() => setLoadingPoints(false))
    }
  }, [user?.id])

  useEffect(() => {
    if (!openReview) {
      setRating(0)
      setComment("")
    }
  }, [openReview])

  useEffect(() => {
    if (tabName != null) {
      setTabData(tabName)
    }
  }, [tabName])

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
      <Tabs value={tabData} onValueChange={(value) => setTabData(value)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">Browse Services</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="wallet">My Wallet</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="loyalty">My Loyalty Points</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <ServiceBrowser onBookService={handleBookService} />
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-gray-900">My Bookings</CardTitle>
              <p className="text-sm text-gray-500">Track all your service bookings in one place</p>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-14 w-14 mx-auto mb-4 opacity-40" />
                  <p className="mb-4">No bookings yet. Browse services to get started!</p>
                  <Button size="sm" className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                    Browse Services
                  </Button>
                </div>
              ) : (
                <div className="space-y-5">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-5 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex flex-col">
                            <h4 className="font-semibold text-gray-900">
                              {booking.service.name}
                              <span
                                className="ml-2 text-indigo-600 text-sm font-medium cursor-pointer hover:underline"
                                onClick={() => {
                                  setSelectedProvider(booking.service.user)
                                  setOpenProviderDialog(true)
                                }}
                              >
                                – Hồ sơ
                              </span>
                            </h4>
                          </div>

                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Customer:</span> {booking.user?.fullName}
                          </p>
                        </div>
                        <Badge
                          className={`
                  px-3 py-1 rounded-full text-xs font-medium shadow-sm
                  ${booking.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : booking.status === "in-progress"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                            }
                `}
                        >
                          {booking.status.replace("-", " ")}
                        </Badge>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-4">
                        <div>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-400" /> Start
                          </p>
                          <p className="font-medium text-gray-700">{booking.startTime.split("T").join(" ")}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" /> End
                          </p>
                          <p className="font-medium text-gray-700">{booking.endTime.split("T").join(" ")}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="font-semibold text-emerald-600">
                            {booking.service.discountPrice.toLocaleString()} ₫
                          </p>
                        </div>
                      </div>

                      {booking.status.toLowerCase() === "completed" && user?.role === "Customer" && booking.reviews.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500">Your Rating</p>
                          <div className="flex items-center gap-1 text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < (booking.reviews[0].rating ?? 0) ? "fill-current" : "stroke-current"
                                  }`}
                              />
                            ))}
                          </div>
                          {booking.reviews[0].comment && (
                            <p className="text-xs text-gray-600 mt-1 italic">
                              “{booking.reviews[0].comment}”
                            </p>
                          )}
                        </div>
                      )}

                      {booking.status.toLowerCase() === "completed" && user?.role === "Customer" && booking.reviews.length == 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg hover:border-gray-300"
                          onClick={() => {
                            setSelectedBooking(booking)
                            setOpenReview(true)
                          }}
                        >
                          Đánh giá
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Dialog open={openReview} onOpenChange={setOpenReview}>
            <DialogContent className="sm:max-w-md rounded-2xl shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Đánh giá dịch vụ
                </DialogTitle>
              </DialogHeader>

              {isWithin2Days ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Chọn số sao</p>
                    <Rate value={rating} onChange={setRating} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nhận xét</p>
                    <Input.TextArea
                      rows={4}
                      placeholder="Hãy chia sẻ trải nghiệm của bạn..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-400 italic">
                    Bạn chỉ có thể chỉnh sửa feedback trong vòng 2 ngày sau khi hoàn tất
                    dịch vụ.
                  </p>
                  <DialogFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setOpenReview(false)}
                      className="rounded-xl"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleSubmitReview}
                      disabled={loading}
                      className="rounded-xl bg-emerald-600 text-white"
                    >
                      {loading ? "Đang gửi..." : "Gửi Review"}
                    </Button>
                  </DialogFooter>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-6">
                  ⏳ Đã quá hạn 2 ngày để gửi feedback cho dịch vụ này.
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <ProviderProfileDialog
          open={openProviderDialog}
          onClose={() => setOpenProviderDialog(false)}
          provider={selectedProvider}
        />

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-gray-900">My Profile</CardTitle>
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
              <CardTitle className="text-xl font-bold text-gray-900">My Wallet</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              {wallet ? (
                <div className="text-center space-y-6">
                  <h3 className="text-4xl font-bold tracking-tight text-gray-900">
                    {wallet.balance.toLocaleString()} ₫
                  </h3>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={() => setOpenDeposit(true)} variant="outline" className="rounded-xl">
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

          <Dialog open={openDeposit} onOpenChange={setOpenDeposit}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Nạp tiền</DialogTitle>
                <DialogDescription>
                  Nhập số tiền bạn muốn nạp vào tài khoản.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Số tiền
                  </Label>
                  <div className="relative col-span-3">
                    <div className="absolute inset-y-0 left-0 flex items-center z-[1] pl-3 pointer-events-none">
                      <span className="text-muted-foreground">₫</span>
                    </div>
                    <Input
                      id="amount"
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      className="!pl-9"
                      placeholder="Nhập số tiền"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => handlePayment(handleDeposit)}>Xác nhận nạp</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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

        <TabsContent value="transactions" className="space-y-4">
          <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-gray-900">Transaction History</CardTitle>
              <p className="text-sm text-gray-500">Track all your wallet and booking transactions</p>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Receipt className="h-14 w-14 mx-auto mb-4 opacity-40" />
                  <p className="mb-4">No transactions yet. Start booking or top up your wallet!</p>
                </div>
              ) : (
                <div className="divide-y">
                  {transactions.map((tx) => {
                    const isSuccess = tx.status?.toLowerCase() === "success"
                    const isPending = tx.status?.toLowerCase() === "pending"
                    const isFailed = tx.status?.toLowerCase() === "failed"

                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between py-4 hover:bg-gray-50 px-3 rounded-lg transition"
                      >
                        {/* Left info */}
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${isSuccess
                              ? "bg-emerald-100 text-emerald-600"
                              : isPending
                                ? "bg-yellow-100 text-yellow-600"
                                : isFailed
                                  ? "bg-rose-100 text-rose-600"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                          >
                            {isSuccess && <CheckCircle2 className="h-5 w-5" />}
                            {isPending && <Clock className="h-5 w-5" />}
                            {isFailed && <XCircle className="h-5 w-5" />}
                            {!isSuccess && !isPending && !isFailed && (
                              <Receipt className="h-5 w-5" />
                            )}
                          </div>

                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {isSuccess
                                ? "Payment Successful"
                                : isPending
                                  ? "Transaction Pending"
                                  : isFailed
                                    ? "Payment Failed"
                                    : "Transaction"}
                            </span>
                            <span className="text-sm text-gray-500">
                              {tx.createdAt
                                ? new Date(tx.createdAt).toLocaleDateString("vi-VN")
                                : ""}
                            </span>
                          </div>
                        </div>

                        {/* Right info */}
                        <div className="flex flex-col text-right">
                          <span
                            className={`font-semibold ${tx.amount && tx.amount > 0
                              ? "text-emerald-600"
                              : "text-rose-600"
                              }`}
                          >
                            {tx.amount && tx.amount > 0 ? "+" : ""}
                            {tx.amount?.toLocaleString()} {tx.currency}
                          </span>
                          <Badge
                            className={`
                  mt-1 px-2 py-0.5 text-xs rounded-full w-fit ml-auto
                  ${isSuccess
                                ? "bg-emerald-100 text-emerald-700"
                                : isPending
                                  ? "bg-yellow-100 text-yellow-700"
                                  : isFailed
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-gray-100 text-gray-600"
                              }
                `}
                          >
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-4">
          <Card className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-gray-900">My Loyalty Points</CardTitle>
              <p className="text-sm text-gray-500">
                Earn points by booking services and giving feedback
              </p>
            </CardHeader>
            <CardContent>
              {loadingPoints ? (
                <div className="text-center py-12 text-gray-500">
                  <Loader2 className="h-10 w-10 mx-auto mb-4 animate-spin opacity-40" />
                  <p>Loading your loyalty points...</p>
                </div>
              ) : points === null || points === undefined ? (
                <div className="text-center py-12 text-gray-500">
                  <Gift className="h-14 w-14 mx-auto mb-4 opacity-40" />
                  <p className="mb-4">No loyalty points yet. Start booking to earn rewards!</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="p-6 bg-gradient-to-r from-amber-100 to-yellow-200 rounded-full shadow-inner">
                    <Star className="h-12 w-12 text-amber-500" />
                  </div>
                  <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
                    {points.toLocaleString()} pts
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Your current loyalty balance
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>


      </Tabs>

      {/* Booking Flow Modal */}
      {selectedService && (
        <BookingFlow
          service={selectedService}
          isOpen={showBookingFlow}
          wallet={wallet}
          onClose={() => {
            setShowBookingFlow(false)
            setSelectedService(null)
          }}
          fetchWallet={fetchWallet}
          fetchData={fetchData}
          setTabData={setTabData}
          onBookingComplete={handleBookingComplete}
        />
      )}

      <Dialog open={openPayOS} onOpenChange={setOpenPayOS} >
        <DialogContent
          className="max-w-full w-full h-full p-0 bg-transparent border-0 shadow-none flex items-center justify-center"
          showCloseButton={false}
        >
          <div id="payos-container"
            style={{ height: "100vh", width: "100vw" }} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
