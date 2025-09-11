"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star, Clock, User, Calendar, Check } from "lucide-react"
import type { Service, ServiceDTO } from "@/types/service"
import { serviceCategories } from "@/types/service"
import CarouselWithThumbs from "../customized/carousel/carousel-09"

interface ServiceDetailModalProps {
  service: Service
  onClose: () => void
  onBook: () => void
}

export function ServiceDetailModal({ service, onClose, onBook }: ServiceDetailModalProps) {
  const category = serviceCategories.find((cat) => cat.id === service.category.id)

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-white">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold tracking-tight text-gray-900">
            {service.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-6">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Media */}
            {service?.imageUrl && (
              <div className="rounded-2xl overflow-hidden shadow-md">
                <CarouselWithThumbs images={service.imageUrl.split(", ")} />
              </div>
            )}

            {/* Meta */}
            <div className="flex items-center gap-4 flex-wrap">
              <Badge className="px-3 py-1 rounded-full text-sm bg-gray-100">
                {category?.icon} {category?.name}
              </Badge>
              <div className="flex items-center gap-1 text-yellow-600 text-sm">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-medium">4.9 (23 reviews)</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed text-base">
              {service.description}
            </p>

            {/* Included */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h4 className="font-semibold text-lg mb-3 text-gray-900">
                What’s Included
              </h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" /> Initial consultation
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" /> Professional delivery
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" /> Revisions included
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" /> Final deliverables
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" /> 30-day support
                </li>
              </ul>
            </div>

            {/* Tags */}
            {service?.tags?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">Skills & Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="text-xs rounded-full bg-indigo-50 text-indigo-700"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="divide-y divide-gray-100">
              <h4 className="font-semibold mb-4 text-gray-900">Recent Reviews</h4>
              {[
                {
                  name: "Sarah M.",
                  date: "2 days ago",
                  text: "Excellent work! Exceeded my expectations.",
                },
                {
                  name: "Mike R.",
                  date: "1 week ago",
                  text: "Professional service, delivered on time.",
                },
              ].map((review, i) => (
                <div key={i} className="py-4 flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    {review.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <span className="font-medium text-gray-900">
                        {review.name}
                      </span>
                      <span className="text-sm text-gray-400">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{review.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pricing */}
            <div className=" bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="text-4xl font-extrabold text-blue-500">
                  ${service.discountPrice}
                </div>
                <div className="text-sm text-gray-500 line-through">
                  ${service.originalPrice}
                </div>
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                  Save 30%
                </span>
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-2">
                  <Clock className="h-4 w-4" /> {service.duration} minutes
                </p>
              </div>
              <Button className="w-full bg-gradient-to-r bg-blue-500 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:scale-105 transition-transform">
                <Calendar className="h-5 w-5 mr-2" />
                Book Now
              </Button>
              <Button variant="outline" className="w-full border-indigo-200 text-blue-500 rounded-xl">
                <User className="h-5 w-5 mr-2" />
                Contact Provider
              </Button>
              <div className="flex items-center justify-center gap-3 text-xs text-gray-400 pt-2">
                <span>🔒 Secure Payment</span>
                <span>✅ Verified Provider</span>
              </div>
            </div>


            {/* Provider */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h4 className="font-semibold mb-3">About the Provider</h4>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">John Provider</div>
                  <div className="text-sm text-gray-500">
                    Professional Designer
                  </div>
                </div>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  4.9 rating (47 reviews)
                </li>
                <li>5+ years experience</li>
                <li>150+ completed projects</li>
                <li>Responds within 2 hours</li>
              </ul>
            </div>

            {/* Delivery */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h4 className="font-semibold mb-2">Delivery</h4>
              <p className="text-sm text-gray-600 space-y-1">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Typical delivery: 3-5 days
                </span>
                <span>Rush delivery available (+50%)</span>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
