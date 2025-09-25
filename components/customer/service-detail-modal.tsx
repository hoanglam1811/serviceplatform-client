"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star, Clock, User, Calendar, Check } from "lucide-react"
import type { Service, ServiceDTO } from "@/types/service"
import { serviceCategories } from "@/types/service"
import CarouselWithThumbs from "../customized/carousel/carousel-09"
import Link from "next/link"
import { motion } from "framer-motion"

interface ServiceDetailModalProps {
  service: Service
  onClose: () => void
  onBook: () => void
  currentUserId?: string
}

export function ServiceDetailModal({ service, onClose, onBook, currentUserId }: ServiceDetailModalProps) {
  const category = serviceCategories.find((cat) => cat.id === service.category.id)
  const hasDiscount =
    typeof service.originalPrice === "number" &&
    typeof service.discountPrice === "number" &&
    service.originalPrice > service.discountPrice

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl p-0">
        {/* glassmorphism shell */}
        <div className="w-full h-full rounded-3xl overflow-hidden bg-white/60 backdrop-blur-lg border border-white/20 shadow-lg">
          {/* header */}
          <DialogHeader className="px-8 pt-6 pb-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <DialogTitle className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r text-black">
                  {service.name}
                </DialogTitle>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-semibold text-sm">4.9</span>
                    <span className="text-xs text-gray-400">· 23 reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* body */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-8 py-6 max-h-[72vh] overflow-y-auto">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Carousel */}
              {service?.imageUrl && (
                <div className="rounded-2xl overflow-hidden shadow-2xl group hover:shadow-2xl transition-shadow">
                  <div className="relative">
                    <CarouselWithThumbs images={service.imageUrl.split(", ").map((s) => s.trim())} />
                    {/* subtle overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
                  </div>
                </div>
              )}

              {/* meta / badges */}
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className="px-4 py-1.5 rounded-full text-sm bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700">
                  {category?.icon} <span className="ml-2">{category?.name}</span>
                </Badge>

                <div className="px-3 py-1 rounded-full bg-white/60 border border-white/30 text-sm text-gray-700 shadow-sm">
                  <Clock className="inline-block mr-1 -mt-0.5" /> {service.duration} minutes
                </div>

                <div className="ml-auto hidden md:flex items-center gap-2 text-sm">
                  <span className="text-green-600 font-medium">Verified</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500">Secure Payment</span>
                </div>
              </div>

              {/* description */}
              <div className="bg-white/50 border border-white/20 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">About this service</h4>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
              </div>

              {/* what's included */}
              <div className="bg-white/40 border border-white/15 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-900 mb-3">What’s included</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Initial consultation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Professional delivery</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Revisions included</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Final deliverables</span>
                  </li>
                </ul>
              </div>

              {/* tags */}
              {service?.tags?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900">Skills & Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <motion.span
                        key={tag}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="px-3 py-1 rounded-full text-xs bg-indigo-50/80 border border-indigo-100 text-indigo-700"
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* reviews */}
              <div className="divide-y divide-white/10">
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
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-sm font-semibold">
                      {review.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">{review.name}</span>
                            <span className="text-xs text-gray-400">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{review.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right sidebar */}
            <motion.aside
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-6 bg-white/70 border border-white/20 rounded-3xl p-6 shadow-xl">
                <div className="text-center space-y-3">
                  <div className="text-4xl md:text-5xl font-extrabold">
                    {service.discountPrice?.toLocaleString?.() ?? service.discountPrice} ₫
                  </div>

                  {hasDiscount && (
                    <div className="text-sm text-gray-400 line-through">
                      {service.originalPrice?.toLocaleString?.()} ₫
                    </div>
                  )}

                  {hasDiscount && (
                    <div className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                      Save{" "}
                      {Math.round(
                        ((service.originalPrice - service.discountPrice) / service.originalPrice) * 100
                      )}
                      %
                    </div>
                  )}

                  <p className="text-sm text-gray-500 flex items-center justify-center gap-2 mt-2">
                    <Clock className="h-4 w-4" /> {service.duration} minutes
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  <Button
                    onClick={onBook}
                    className="w-full py-3 rounded-2xl font-semibold text-lg shadow-lg"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Book Now
                  </Button>

                  {currentUserId !== service.userId && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-2xl border-indigo-200 text-indigo-700"
                    >
                      <Link
                        href={`/provider/${service.userId}`}
                        className="flex items-center justify-center gap-2 w-full"
                      >
                        <User className="h-5 w-5 mr-1" /> Contact Provider
                      </Link>
                    </Button>

                  )}

                  <div className="flex items-center justify-center gap-3 text-xs text-gray-400 pt-2">
                    <span>🔒 Secure Payment</span>
                    <span>✅ Verified Provider</span>
                  </div>
                </div>

                {/* CTA small footer */}
                <div className="mt-6 text-center text-xs text-gray-500">
                  <div>Need a custom offer? <button className="underline text-indigo-600" onClick={() => { /* optional handler */ }}>Contact us</button></div>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
