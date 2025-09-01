"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, EyeOff } from "lucide-react"
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
    <Card className={`${service?.status?.toLowerCase() != "active" ? "opacity-60" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{service.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">
                {service.category?.icon} {service.category?.name} 
              </Badge>
              <Badge variant={service?.status?.toLowerCase() == "active" ? "default" : "secondary"}>
                {service.status}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => onToggleActive(service.id)}>
              {service.status.toLowerCase() == "active" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onEdit(service)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(service.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-green-600">${service.discountPrice}</span>
          <span className="text-gray-500">{service.duration}</span>
        </div>
        {service?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {service.tags.slice(0, 3).map((tag) => (
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
