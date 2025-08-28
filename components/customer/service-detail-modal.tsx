"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star, Clock, User, Calendar } from "lucide-react"
import type { Service, ServiceDTO } from "@/types/service"
import { serviceCategories } from "@/types/service"

interface ServiceDetailModalProps {
  service: ServiceDTO
  onClose: () => void
  onBook: () => void
}

export function ServiceDetailModal({ service, onClose, onBook }: ServiceDetailModalProps) {
  const category = serviceCategories.find((cat) => cat.id === service.category)

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{service.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Image */}
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={service.images[0] || "/placeholder.svg?height=300&width=500&query=service detail image"}
              alt={service.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Service Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">
                    {category?.icon} {category?.name}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-yellow-600">
                    <Star className="h-4 w-4 fill-current" />
                    <span>4.9 (23 reviews)</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">What's Included:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Initial consultation and requirements gathering</li>
                  <li>• Professional service delivery</li>
                  <li>• Revisions based on feedback</li>
                  <li>• Final deliverables in required format</li>
                  <li>• 30-day support after completion</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Skills & Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Pricing Card */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-600 mb-1">${service.price}</div>
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4" />
                    {service.duration} minutes
                  </div>
                </div>

                <Button className="w-full mb-3" onClick={onBook}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Book This Service
                </Button>

                <Button variant="outline" className="w-full bg-transparent">
                  <User className="h-4 w-4 mr-2" />
                  Contact Provider
                </Button>
              </div>

              {/* Provider Info */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">About the Provider</h4>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">John Provider</div>
                    <div className="text-sm text-gray-600">Professional Designer</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <span>4.9 rating (47 reviews)</span>
                  </div>
                  <div>• 5+ years experience</div>
                  <div>• 150+ completed projects</div>
                  <div>• Responds within 2 hours</div>
                </div>
              </div>

              {/* Delivery Time */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Delivery</h4>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="h-4 w-4" />
                    <span>Typical delivery: 3-5 days</span>
                  </div>
                  <div>Rush delivery available for +50%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div>
            <h4 className="font-semibold mb-4">Recent Reviews</h4>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 text-yellow-600">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-medium">Sarah M.</span>
                  <span className="text-sm text-gray-500">2 days ago</span>
                </div>
                <p className="text-sm text-gray-700">
                  "Excellent work! The logo exceeded my expectations and the communication was great throughout the
                  process."
                </p>
              </div>
              <div className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 text-yellow-600">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-medium">Mike R.</span>
                  <span className="text-sm text-gray-500">1 week ago</span>
                </div>
                <p className="text-sm text-gray-700">
                  "Professional service, delivered on time. Will definitely work with again!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
