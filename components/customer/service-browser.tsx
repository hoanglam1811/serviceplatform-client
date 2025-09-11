"use client"

import { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, Star, Clock, DollarSign } from "lucide-react"
import type { Service, ServiceCategory, ServiceDTO } from "@/types/service"
import { ServiceDetailModal } from "./service-detail-modal"
import { getAllServices } from "@/services/serviceService"
import { getAllCategories } from "@/services/serviceCategoryService"

interface ServiceBrowserProps {
  onBookService?: (service: Service) => void
}

export function ServiceBrowser({ onBookService }: ServiceBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [services, setServices] = useState<Service[] | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[] | null>(null);

  const fetchData = async () => {
    try {
      const [services, categories] = await Promise.all([
        getAllServices(),
        getAllCategories()
      ])
      setServices(services.data)
      setCategories(categories.data)
    }
    catch (err) {
      console.log(err)
    }
    finally {

    }
  }

  const filteredServices = useMemo(() => {
    if (!services || !categories) return [];
    let filtered = services.filter((service) => service.status.toLowerCase() == "active")

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service?.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((service) => service.category.id === selectedCategory)
    }

    // Price range filter
    if (priceRange !== "all") {
      switch (priceRange) {
        case "under-100":
          filtered = filtered.filter((service) => service.discountPrice < 100)
          break
        case "100-300":
          filtered = filtered.filter((service) => service.discountPrice >= 100 && service.discountPrice <= 300)
          break
        case "over-300":
          filtered = filtered.filter((service) => service.discountPrice > 300)
          break
      }
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.discountPrice - b.discountPrice)
        break
      case "price-high":
        filtered.sort((a, b) => b.discountPrice - a.discountPrice)
        break
      case "duration":
        filtered.sort((a, b) => a.duration - b.duration)
        break
      default:
        filtered.sort((a, b) => b?.createdAt?.getTime() - a?.createdAt?.getTime())
    }

    return filtered
  }, [searchQuery, selectedCategory, priceRange, sortBy, services])

  useEffect(() => {
    fetchData()

  }, [])

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search services, skills, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline" className="md:w-auto bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        {category.icon ? (
                          <img
                            src={category.icon}
                            alt={category.name}
                            className="w-5 h-5 object-contain rounded"
                          />
                        ) : (
                          <span className="w-5 h-5 bg-gray-200 rounded" />
                        )}
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>

              </Select>
            </div>

            <div>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-100">Under $100</SelectItem>
                  <SelectItem value="100-300">$100 - $300</SelectItem>
                  <SelectItem value="over-300">Over $300</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {filteredServices.length} service{filteredServices.length !== 1 ? "s" : ""} found
        </h3>
      </div>

      {/* Service Grid */}
      {filteredServices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No services found</h3>
            <p className="text-gray-600 text-center">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceBrowseCard
              key={service.id}
              service={service}
              categories={categories || []}
              onViewDetails={() => setSelectedService(service)}
              onBook={() => onBookService?.(service)}
            />
          ))}
        </div>
      )}

      {/* Service Detail Modal */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onBook={() => {
            onBookService?.(selectedService)
            setSelectedService(null)
          }}
        />
      )}
    </div>
  )
}

interface ServiceBrowseCardProps {
  service: Service
  categories: ServiceCategory[]
  onViewDetails: () => void
  onBook: () => void
}

function ServiceBrowseCard({ service, categories, onViewDetails, onBook }: ServiceBrowseCardProps) {
  const category = categories.find((cat) => cat.id === service.category.id)

  return (
    <Card className="py-0 pb-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={onViewDetails}>
      <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
        <img
          src={service?.imageUrl?.split(", ")[0] || "/placeholder.svg?height=200&width=300&query=service placeholder"}
          alt={service.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{service.name}</CardTitle>
          <div className="flex items-center gap-1 text-sm text-yellow-600">
            <Star className="h-4 w-4 fill-current" />
            <span>4.9</span>
          </div>
        </div>
        <Badge variant="outline" className="w-fit flex items-center gap-2">
          {category?.icon ? (
            <img
              src={category?.icon}
              className="w-4 h-4 object-contain rounded"
            />
          ) : (
            <span className="w-4 h-4 inline-block bg-gray-200 rounded" />
          )}
          <span>{category?.name}</span>
        </Badge>

      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>

        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{service.duration} minutes</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-green-600">
            <DollarSign className="h-4 w-4" />
            <span>{service.discountPrice}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {service?.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {service?.tags?.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{service.tags.length - 3}
            </Badge>
          )}
        </div>

        <Button
          className="w-full"
          onClick={(e) => {
            e.stopPropagation()
            onBook()
          }}
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  )
}
