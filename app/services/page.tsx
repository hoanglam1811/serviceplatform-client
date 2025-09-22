"use client"

import { ServiceBrowser } from "@/components/customer/service-browser"
import { BookingFlow } from "@/components/booking/booking-flow"
import { useEffect, useState } from "react"
import type { Service } from "@/types/service"
import { Navbar } from "@/components/navigation/navbar"
import { getWalletByUserId } from "@/services/walletService"
import { useAuth } from "@/contexts/auth-context"
import { notification } from "antd"

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showBookingFlow, setShowBookingFlow] = useState(false)
  const [wallet, setWallet] = useState<any>(null)
  const { user } = useAuth();

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

  const handleBookingComplete = (bookingId: string) => {
    console.log("Booking completed:", bookingId)
  }

  const fetchWallet = async () => {
    try{
      if(!user) return;
      const res = await getWalletByUserId(user?.id);
      setWallet(res.data)
    }
    catch(err){

    }
    finally{

    }
  }

  useEffect(() => {
    fetchWallet()
  }, [])

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover professional services from talented providers. From design and development to marketing and
            consulting, find exactly what you need.
          </p>
        </div>

        {/* Service Browser */}
        <ServiceBrowser onBookService={handleBookService} />

        {/* Booking Flow Modal */}
        {selectedService && (
          <BookingFlow
            service={selectedService}
            isOpen={showBookingFlow}
            onClose={() => {
              setShowBookingFlow(false)
              setSelectedService(null)
            }}
            wallet={wallet}
            fetchData={async () => {}}
            setTabData={() => {}}
            fetchWallet={fetchWallet}
            onBookingComplete={handleBookingComplete}
          />
        )}
      </div>
    </>
  )
}

