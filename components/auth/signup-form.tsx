"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/contexts/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { notification } from "antd"
import { createProviderProfile } from "@/services/providerProfileService"

interface SignupFormProps {
  onToggleMode: () => void
  user: any
}

export function SignupForm({ onToggleMode, user }: SignupFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    gender: "PreferNotToSay",
    confirmPassword: "",
    nationalId: [] as File[],
    role: "Customer" as "Provider" | "Customer",
    providerType: "Individual" as "Individual" | "Company",
    companyName: "",
    address: "",
    taxCode: "",
    businessPhone: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { signup } = useAuth()

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 6) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const handleCreateProviderProfile = async (user: any) => {
    if (!user?.id) {
      notification.error({
        message: "❌ Lỗi",
        description: "Không tìm thấy userId, vui lòng đăng nhập lại.",
      })
      return
    }

    try {
      await createProviderProfile({
        userId: user.id,
        type: formData.providerType,
        companyName:
          formData.providerType === "Company" ? formData.companyName : null,
        address: formData.providerType === "Company" ? formData.address : null,
        taxCode: formData.providerType === "Company" ? formData.taxCode : null,
        businessPhone:
          formData.providerType === "Company"
            ? formData.businessPhone
            : formData.phoneNumber,
      })

      notification.success({
        message: "🎉 Thành công!",
        description: "Hồ sơ Provider đã được tạo.",
        placement: "topRight",
      })
    } catch (err) {
      notification.error({
        message: "🚨 Lỗi",
        description: "Không thể tạo hồ sơ Provider.",
        placement: "topRight",
      })
    }
  }

  // Đăng ký
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (passwordStrength < 4) {
      setError(
        "Password is too weak. Must include uppercase, number, special character and min 6 chars"
      )
      setIsLoading(false)
      return
    }

    if (!formData.nationalId || formData.nationalId.length === 0) {
      setError("Please upload your National ID card")
      setIsLoading(false)
      return
    }

    try {
      const success = await signup(
        formData.email,
        formData.password,
        formData.fullName,
        formData.username,
        formData.phoneNumber,
        formData.nationalId,
        formData.gender,
        formData.role
      )
      console.log(user)
      if (success) {
        notification.success({
          message: "🎉 Thành công!",
          description: "Vui lòng đợi admin duyệt tài khoản của bạn.",
          placement: "topRight",
        })

        if (formData.role === "Provider") {
          await handleCreateProviderProfile(success)
        }
      } else {
        notification.error({
          message: "❌ Thất bại",
          description: "Tạo tài khoản không thành công, vui lòng thử lại.",
          placement: "topRight",
        })
      }
    } catch (err) {
      notification.error({
        message: "🚨 Lỗi",
        description: "Đã có lỗi xảy ra trong quá trình đăng ký.",
        placement: "topRight",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create account</CardTitle>
        <CardDescription>Join our service marketplace today</CardDescription>
      </CardHeader>
      <CardHeader className="flex justify-center space-y-1">
        <img src={"/Flirting Dog.gif"} />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cột 1 */}
          <div className="col-span-1 md:col-span-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="PreferNotToSay">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <div className="space-y-2 mb-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              {/* Thanh strength */}
              <div className="h-2 w-full bg-gray-200 rounded mt-1 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${passwordStrength === 1
                    ? "bg-red-500 w-1/4"
                    : passwordStrength === 2
                      ? "bg-yellow-500 w-2/4"
                      : passwordStrength === 3
                        ? "bg-blue-500 w-3/4"
                        : passwordStrength === 4
                          ? "bg-green-500 w-full"
                          : "w-0"
                    }`}
                />
              </div>
              <p className="text-xs text-gray-500">
                Must include: 1 uppercase, 1 number, 1 special character, min 6 chars
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2 mb-3">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <div className="space-y-2 mb-4">
              <Label htmlFor="nationalId">National ID (Front/Back)</Label>
              <Input
                ref={fileInputRef}
                id="nationalId"
                type="file"
                accept="image/*"
                multiple
                required
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 2) {
                    alert("Chỉ được chọn tối đa 2 ảnh (mặt trước và mặt sau)");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                    return;
                  }
                  setFormData({ ...formData, nationalId: files });
                }}
              />

              {formData.nationalId.length > 0 && (
                <div className="flex justify-center gap-6 mt-2">
                  {formData.nationalId.map((file, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center space-y-1 relative"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`National ID ${index + 1}`}
                        className="w-32 h-20 object-cover rounded-lg border"
                      />
                      <span className="text-xs text-gray-600 truncate w-32 text-center">
                        {file.name}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          const newFiles = formData.nationalId.filter(
                            (_, i) => i !== index
                          );
                          setFormData({ ...formData, nationalId: newFiles });

                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>I want to:</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    role: value as "Provider" | "Customer",
                  })
                }
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="Customer" id="customer" />
                  <Label htmlFor="customer" className="flex flex-col">
                    <span className="font-medium">Find and book services</span>
                    <span className="text-sm text-muted-foreground">
                      I want to hire professionals (electrician, cleaner, tutor, etc.)
                    </span>
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="Provider" id="provider" />
                  <Label htmlFor="provider" className="flex flex-col">
                    <span className="font-medium">Offer my services</span>
                    <span className="text-sm text-muted-foreground">
                      I want to provide services and get hired by customers
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <br></br>
            <br></br>

            {formData.role === "Provider" && (
              <div className="space-y-3 mt-3">
                <Label>Provider Type:</Label>
                <RadioGroup
                  value={formData.providerType}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      providerType: value as "Individual" | "Company",
                    })
                  }
                >
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="Individual" id="individual" />
                    <Label htmlFor="individual" className="flex flex-col">
                      <span className="font-medium">Individual</span>
                      <span className="text-sm text-muted-foreground">
                        I am a personal provider offering my own services
                      </span>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="Company" id="company" />
                    <Label htmlFor="company" className="flex flex-col">
                      <span className="font-medium">Company</span>
                      <span className="text-sm text-muted-foreground">
                        I represent a registered business with legal entity
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}


            {formData.role === "Provider" && formData.providerType === "Company" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Company Address</Label>
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxCode">Tax Code</Label>
                  <Input
                    id="taxCode"
                    type="text"
                    value={formData.taxCode}
                    onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                    placeholder="Enter tax code"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input
                    id="businessPhone"
                    type="text"
                    value={formData.businessPhone}
                    onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                    placeholder="Enter business phone"
                    required
                  />
                </div>
              </div>
            )}

            <br />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <button onClick={onToggleMode} className="text-blue-600 hover:underline font-medium">
            Sign in
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
