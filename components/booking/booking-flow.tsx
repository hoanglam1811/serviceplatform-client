"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarDays, Clock, CreditCard, CheckCircle } from "lucide-react"
import type { Service } from "@/types/service"
import type { BookingRequest } from "@/types/booking"
import { useAuth } from "@/contexts/auth-context"

interface BookingFlowProps {
  service: Service
  isOpen: boolean
  onClose: () => void
  onBookingComplete: (bookingId: string) => void
}

type BookingStep = "datetime" | "details" | "payment" | "confirmation"

export function BookingFlow({ service, isOpen, onClose, onBookingComplete }: BookingFlowProps) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState<BookingStep>("datetime")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [requirements, setRequirements] = useState("")
  const [notes, setNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Generate available time slots
  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ]

  const handleDateTimeNext = () => {
    if (selectedDate && selectedTime) {
      setCurrentStep("details")
    }
  }

  const handleDetailsNext = () => {
    setCurrentStep("payment")
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create booking
    const bookingRequest: BookingRequest = {
      serviceId: service.id,
      scheduledDate: selectedDate!,
      scheduledTime: selectedTime,
      requirements,
      notes,
    }

    // Mock booking creation
    const bookingId = `booking_${Date.now()}`

    setIsProcessing(false)
    setCurrentStep("confirmation")

    // Complete booking after showing confirmation
    setTimeout(() => {
      onBookingComplete(bookingId)
      onClose()
      resetFlow()
    }, 3000)
  }

  const resetFlow = () => {
    setCurrentStep("datetime")
    setSelectedDate(undefined)
    setSelectedTime("")
    setRequirements("")
    setNotes("")
    setIsProcessing(false)
  }

  const handleClose = () => {
    onClose()
    resetFlow()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Book Service: {service.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {[
              { key: "datetime", label: "Date & Time", icon: CalendarDays },
              { key: "details", label: "Details", icon: Clock },
              { key: "payment", label: "Payment", icon: CreditCard },
              { key: "confirmation", label: "Confirmation", icon: CheckCircle },
            ].map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep === step.key
                      ? "bg-blue-600 text-white"
                      : index < ["datetime", "details", "payment", "confirmation"].indexOf(currentStep)
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <step.icon className="h-4 w-4" />
                </div>
                <span className="ml-2 text-sm font-medium hidden md:block">{step.label}</span>
                {index < 3 && <div className="w-8 h-px bg-gray-300 mx-4 hidden md:block" />}
              </div>
            ))}
          </div>

          {/* Service Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{service.title}</h3>
                  <p className="text-sm text-gray-600">Duration: {service.duration} minutes</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">${service.price}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step Content */}
          {currentStep === "datetime" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Date & Time</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">Choose Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    className="rounded-md border"
                  />
                </div>
                <div>
                  <Label className="text-base font-medium mb-3 block">Choose Time</Label>
                  <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        disabled={!selectedDate}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleDateTimeNext} disabled={!selectedDate || !selectedTime}>
                  Next: Add Details
                </Button>
              </div>
            </div>
          )}

          {currentStep === "details" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Booking Details</h3>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Selected Schedule</h4>
                <p className="text-sm">
                  <strong>Date:</strong> {selectedDate?.toLocaleDateString()} <br />
                  <strong>Time:</strong> {selectedTime} <br />
                  <strong>Duration:</strong> {service.duration} minutes
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements (Optional)</Label>
                <Textarea
                  id="requirements"
                  placeholder="Describe any specific requirements or preferences for this service..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information you'd like to share with the provider..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep("datetime")}>
                  Back
                </Button>
                <Button onClick={handleDetailsNext}>Next: Payment</Button>
              </div>
            </div>
          )}

          {currentStep === "payment" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment</h3>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span>{service.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{selectedDate?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{service.duration} minutes</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-green-600">${service.price}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Credit Card (Demo)</p>
                          <p className="text-sm text-gray-600">**** **** **** 4242</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      This is a demo booking system. No actual payment will be processed.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep("details")}>
                  Back
                </Button>
                <Button onClick={handlePayment} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : `Pay $${service.price}`}
                </Button>
              </div>
            </div>
          )}

          {currentStep === "confirmation" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-600">Booking Confirmed!</h3>
              <p className="text-gray-600">
                Your booking for "{service.title}" has been confirmed for {selectedDate?.toLocaleDateString()} at{" "}
                {selectedTime}.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Next Steps:</strong>
                  <br />• You'll receive a confirmation email shortly
                  <br />• The provider will contact you before the scheduled time
                  <br />• You can track your booking in the "My Bookings" section
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
