"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, EyeOff, Clock, Monitor, MapPin } from "lucide-react"
import type { Service, ServiceCategory } from "@/types/service"
import { useEffect, useState } from "react"
import { getAllCategories } from "@/services/serviceCategoryService"

interface ServiceCardProps {
  service: Service
  onEdit: (service: Service) => void
  onDelete: (serviceId: string) => void
  onToggleActive: (serviceId: string) => void
}

export function ServiceCard({ service, onEdit, onDelete, onToggleActive }: ServiceCardProps) {


  return (
    <Card className={`${service?.status?.toLowerCase() !== "active" ? "opacity-60" : ""}`}>
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{service.name}</CardTitle>

            <div className="flex items-center gap-2 mt-1">
              {/* Category badge */}
              <Badge variant="outline" className="flex items-center gap-2">
                {service.category?.icon ? (
                  <img
                    src={service.category?.icon}
                    className="w-4 h-4 object-contain rounded"
                  />
                ) : (
                  <span className="w-4 h-4 inline-block bg-gray-200 rounded" />
                )}
                <span>{service.category?.name}</span>
              </Badge>

              {/* Status badge */}
              <Badge
                variant={
                  service?.status?.toLowerCase() === "active" ? "default" : "secondary"
                }
              >
                {service.status}
              </Badge>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onToggleActive(service.id)}
              title={service.status?.toLowerCase() === "active" ? "Ẩn dịch vụ" : "Kích hoạt dịch vụ"}
            >
              {service.status?.toLowerCase() === "active" ? (
                <EyeOff className="h-4 w-4 text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-600" />
              )}
            </Button>

            <Button size="sm" variant="ghost" onClick={() => onEdit(service)} title="Chỉnh sửa">
              <Edit className="h-4 w-4" />
            </Button>

            <Button size="sm" variant="ghost" onClick={() => onDelete(service.id)} title="Xóa">
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Image */}
      {service.imageUrl && (
        <div className="px-4">
          <img
            src={service.imageUrl.split(", ")[0]}
            alt={service.name}
            className="w-full h-40 object-cover rounded-lg mb-3"
          />
        </div>
      )}

      {/* Content */}
      <CardContent>
        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>

        {/* Pricing + Duration */}
        <div className="flex items-center justify-between text-sm mb-2">
          {/* Giá */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-green-600">${service.discountPrice}</span>
            {service.originalPrice > service.discountPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${service.originalPrice}
              </span>
            )}
          </div>

          {/* Duration */}
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{service.duration} phút</span>
          </div>
        </div>

        {/* Service type + Area */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <div className="flex items-center gap-1">
            {service.type === "Online" ? (
              <Monitor className="h-3 w-3" />
            ) : (
              <MapPin className="h-3 w-3" />
            )}
            <span>{service.type}</span>
          </div>
          {service.serviceArea && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{service.serviceArea}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {service?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {service.tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {service.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{service.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
