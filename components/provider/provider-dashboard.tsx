"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, DollarSign, Calendar, Star, TrendingUp } from "lucide-react"
import { ServiceForm } from "./service-form"
import { ServiceCard } from "./service-card"
import { BookingManagement } from "../booking/booking-management"
import type { Service } from "@/types/service"
import { useAuth } from "@/contexts/auth-context"

// Mock services data
const mockServices: Service[] = [
  {
    id: "1",
    providerId: "1",
    title: "Professional Logo Design",
    description: "I'll create a unique, professional logo for your business that captures your brand identity.",
    category: "design",
    price: 150,
    duration: 180,
    images: [],
    tags: ["logo", "branding", "design", "business"],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    providerId: "1",
    title: "Website Development",
    description: "Custom responsive website development using modern technologies.",
    category: "development",
    price: 800,
    duration: 480,
    images: [],
    tags: ["website", "react", "responsive", "modern"],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export function ProviderDashboard() {
  const { user } = useAuth()
  const [services, setServices] = useState<Service[]>(mockServices)
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const handleSaveService = (serviceData: Partial<Service>) => {
    if (editingService) {
      // Update existing service
      setServices(
        services.map((service) =>
          service.id === editingService.id ? { ...service, ...serviceData, updatedAt: new Date() } : service,
        ),
      )
    } else {
      // Create new service
      const newService: Service = {
        id: Date.now().toString(),
        providerId: user?.id || "",
        ...serviceData,
        images: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Service
      setServices([...services, newService])
    }
    setShowServiceForm(false)
    setEditingService(null)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setShowServiceForm(true)
  }

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter((service) => service.id !== serviceId))
  }

  const handleToggleActive = (serviceId: string) => {
    setServices(
      services.map((service) => (service.id === serviceId ? { ...service, isActive: !service.isActive } : service)),
    )
  }

  const activeServices = services.filter((service) => service.isActive)
  const totalEarnings = services.reduce((sum, service) => sum + service.price, 0)

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
        </TabsList>

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
                  <p className="text-gray-600 mb-4">Create your first service to start earning!</p>
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
                  onDelete={handleDeleteService}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <BookingManagement userRole="provider" />
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Provider Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Profile Information</h4>
                  <p className="text-sm text-gray-600">Name: {user?.name}</p>
                  <p className="text-sm text-gray-600">Email: {user?.email}</p>
                  <p className="text-sm text-gray-600">Member since: {user?.createdAt.toLocaleDateString()}</p>
                </div>
                <div className="text-center py-8 text-gray-500">
                  <p>Profile editing features coming soon!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
