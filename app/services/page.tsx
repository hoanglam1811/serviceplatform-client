"use client"

import { ServiceBrowser } from "@/components/customer/service-browser"
import { BookingFlow } from "@/components/booking/booking-flow"
import { useState } from "react"
import type { Service } from "@/types/service"
import { Navbar } from "@/components/navigation/navbar"

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showBookingFlow, setShowBookingFlow] = useState(false)

  const handleBookService = (service: Service) => {
    setSelectedService(service)
    setShowBookingFlow(true)
  }

  const handleBookingComplete = (bookingId: string) => {
    console.log("Booking completed:", bookingId)
    // In a real app, you'd handle the booking completion
  }

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
            onBookingComplete={handleBookingComplete}
          />
        )}
      </div>
    </>
  )
}

