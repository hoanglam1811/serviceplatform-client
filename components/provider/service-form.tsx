"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Loader2 } from "lucide-react"
import type { Service, ServiceCategory } from "@/types/service"
import { getAllCategories } from "@/services/serviceCategoryService"
import { motion } from "framer-motion"

interface ServiceFormProps {
  service?: Service
  onSave: (serviceData: Partial<Service>) => Promise<void>
  onCancel: () => void
}

export function ServiceForm({ service, onSave, onCancel }: ServiceFormProps) {
  const [categories, setCategories] = useState<ServiceCategory[] | null>(null);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: service?.id || "",
    name: service?.name || "",
    description: service?.description || "",
    type: service?.type || "Online",
    serviceArea: service?.serviceArea || "",
    originalPrice: service?.originalPrice || 0,
    discountPrice: service?.discountPrice || 0,
    duration: service?.duration || 0,
    status: service?.status || "Active",
    images: [] as File[],
    categoryId: service?.categoryId || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onSave(formData)
    setLoading(false)
  }

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories()
      setCategories(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="w-full max-w-2xl mx-auto rounded-2xl border border-slate-200/40 bg-white/80 dark:bg-slate-900/70 backdrop-blur-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight">
            {service ? "✏️ Edit Service" : "✨ Create New Service"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Service Title
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Professional Logo Design"
                required
                className="rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your service in detail..."
                rows={4}
                required
                className="rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category + Price */}
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wide text-slate-500">Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
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
                            <span className="w-5 h-5 inline-block bg-gray-200 rounded" />
                          )}
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>

                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Duration */}
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Duration
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: Number(e.target.value) })
                    }
                    required
                    className="rounded-xl focus:ring-2 focus:ring-indigo-500 transition w-24"
                  />
                  <span className="text-sm text-slate-600">phút</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-xs uppercase text-slate-500">Status</Label>
                <Select
                  disabled
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">✅ Active</SelectItem>
                    <SelectItem value="Inactive">🚫 Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label className="text-xs uppercase text-slate-500">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">🌐 Online</SelectItem>
                    <SelectItem value="Offline">🏢 Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>


            {/* Service Area */}
            <div className="space-y-2">
              <Label className="text-xs uppercase text-slate-500">Service Area</Label>
              <Input
                value={formData.serviceArea}
                onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                placeholder="e.g., Ho Chi Minh City, Remote"
                className="rounded-xl"
              />
            </div>

            {/* Price Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase text-slate-500">Original Price ($)</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase text-slate-500">Discount Price ($)</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                  required
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase text-slate-500">Service Images</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setFormData({
                      ...formData,
                      images: Array.from(e.target.files), // chuyển FileList -> File[]
                    });
                  }
                }}
                className="rounded-xl"
              />

              {/* Preview */}
              <div className="mt-2 grid grid-cols-3 gap-2">
                {formData.images.length == 0 &&
                  service?.imageUrl.split(", ").map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Preview ${idx}`}
                      className="h-32 w-full rounded-lg object-cover shadow"
                    />
                  ))
                }
                {formData.images.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${idx}`}
                    className="h-32 w-full rounded-lg object-cover shadow"
                  />
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r bg-black text-white shadow-lg hover:shadow-indigo-500/50 hover:scale-105 transition"
              >
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {loading ? "Please wait..." :
                  (service ? "Update Service" : "Create Service")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="rounded-xl hover:bg-slate-100"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
