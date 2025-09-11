"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, DollarSign, Calendar, Star, TrendingUp, ArrowDownCircle, ArrowUpCircle } from "lucide-react"
import { ServiceForm } from "./service-form"
import { ServiceCard } from "./service-card"
import { BookingManagement } from "../booking/booking-management"
import { type Service } from "@/types/service"
import { useAuth } from "@/contexts/auth-context"
import { createService, getAllServicesByUserId, updateService } from "@/services/serviceService"
import ProviderProfile from "@/app/provider-profile/page"
import { notification } from "antd"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createWallet, getWalletByUserId } from "@/services/walletService"

export function ProviderDashboard() {
  const { user } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingService, setDeletingService] = useState<Service | null>(null)
  const [wallet, setWallet] = useState<any | null>(null)

  const fetchServices = async () => {
    try {
      const res = await getAllServicesByUserId(user?.id || "")
      setServices(res.data as Service[])
    } catch (err) {
      console.log(err)
      notification.error({
        message: "Error",
        description: "Failed to fetch services",
      })
    }
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

  const handleSaveService = async (serviceData: Partial<Service>) => {
    try {
      if (editingService) {
        if (!serviceData.id) return
        await updateService(serviceData.id, serviceData as any)
        notification.success({
          message: "Service Updated",
          description: "Your service has been updated successfully.",
        })
      } else {
        serviceData.userId = user?.id
        serviceData.status = "Active"
        await createService(serviceData as any)
        notification.success({
          message: "Service Created",
          description: "Your new service has been created successfully.",
        })
      }
      await fetchServices()
      setShowServiceForm(false)
      setEditingService(null)
    } catch (err) {
      console.log(err)
      notification.error({
        message: "Error",
        description: "Something went wrong while saving the service.",
      })
    }
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setShowServiceForm(true)
  }

  const confirmDelete = async () => {
    if (!deletingService) return
    try {
      await updateService(deletingService.id, {
        ...deletingService,
        status: "Inactive",
      } as any)
      notification.success({
        message: "Service Inactivated",
        description: "This service is now inactive and hidden from clients.",
      })
      await fetchServices()
    } catch (err) {
      console.log(err)
      notification.error({
        message: "Error",
        description: "Failed to deactivate service.",
      })
    } finally {
      setIsDeleteOpen(false)
      setDeletingService(null)
    }
  }

  const handleToggleActive = async (serviceId: string) => {
    try {
      const service = services.find((s) => s.id === serviceId)
      if (!service) return
      const newStatus =
        service.status?.toLowerCase() === "active" ? "Inactive" : "Active"
      await updateService(serviceId, { ...service, status: newStatus } as any)
      notification.success({
        message: "Status Updated",
        description: `Service status changed to ${newStatus}.`,
      })
      await fetchServices()
    } catch (err) {
      console.log(err)
      notification.error({
        message: "Error",
        description: "Failed to update service status.",
      })
    }
  }

  const activeServices = services.filter(
    (service) => service?.status?.toLowerCase() === "active"
  )

  const totalEarnings = services.reduce(
    (sum, service) => sum + (service.discountPrice || 0),
    0
  )

  const openDeleteModal = (service: Service) => {
    setDeletingService(service)
    setIsDeleteOpen(true)
  }

  useEffect(() => {
    if (user?.id) {
      fetchServices()
      fetchWallet()
    }
  }, [user?.id])

  if (showServiceForm) {
    return (
      <ServiceForm
        service={editingService || undefined}
        onSave={handleSaveService}
        onCancel={() => {
          setShowServiceForm(false)
          setEditingService(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">{activeServices.length} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Based on 47 reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">My Services</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="wallet">My Wallet</TabsTrigger>
        </TabsList>

        {/* Services */}
        <TabsContent value="services" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Your Services</h3>
            <Button onClick={() => setShowServiceForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>

          {services.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">No services yet</h3>
                  <p className="text-gray-600 mb-4">
                    Create your first service to start earning!
                  </p>
                  <Button onClick={() => setShowServiceForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Service
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onEdit={handleEditService}
                  onDelete={() => openDeleteModal(service)}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Bookings */}
        <TabsContent value="bookings" className="space-y-4">
          <BookingManagement userRole="provider" />
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Provider Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <ProviderProfile />
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
                  <div>
                    <h3 className="text-4xl font-bold tracking-tight text-gray-900">
                      {wallet.balance.toLocaleString()} ₫
                    </h3>

                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => console.log("Deposit")}
                    >
                      <ArrowUpCircle className="h-4 w-4 mr-2" />
                      Nạp tiền
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => console.log("Withdraw")}
                    >
                      <ArrowDownCircle className="h-4 w-4 mr-2" />
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
                    onClick={handleCreateWallet}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Tạo ví
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transactions */}
          {wallet && (
            <Card className="border border-gray-200 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base font-medium text-gray-700">
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-gray-100 text-sm">
                  <li className="flex justify-between py-3">
                    <span className="text-gray-700">Nạp tiền</span>
                    <span className="text-green-600 font-medium">+500,000 ₫</span>
                  </li>
                  <li className="flex justify-between py-3">
                    <span className="text-gray-700">Rút tiền</span>
                    <span className="text-red-600 font-medium">-200,000 ₫</span>
                  </li>
                  <li className="flex justify-between py-3">
                    <span className="text-gray-700">Thanh toán dịch vụ</span>
                    <span className="text-red-600 font-medium">-150,000 ₫</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Service</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            Are you sure you want to deactivate{" "}
            <span className="font-medium text-gray-800">{deletingService?.name}</span>? <br />
            This service will not be permanently deleted — it will be marked as <strong>Inactive</strong>
            and hidden from clients.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
