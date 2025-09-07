"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
    duration: service?.duration || "",
    status: service?.status || "Active",
    images: [] as File[],
    categoryId: service?.categoryId || "",
    tags: service?.tags || [],
  })

  const [newTag, setNewTag] = useState("")

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

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

            {/* Category + Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wide text-slate-500">Price ($)</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                  required
                  className="rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wide text-slate-500">Duration</Label>
              <Input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
                className="rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div className="space-y-2">
                <Label className="text-xs uppercase text-slate-500">Status</Label>
                <Select
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

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wide text-slate-500">Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  className="rounded-xl"
                />
                <Button type="button" onClick={handleAddTag} variant="outline" className="rounded-xl">
                  Add
		 </Button>
              </div>
              <motion.div layout className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <motion.div
                    key={tag}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                  >
                    <Badge
                      variant="secondary"
                      className="rounded-full px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 flex items-center gap-1"
                    >
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
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
