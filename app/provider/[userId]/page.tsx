"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getProviderProfileByUserId } from "@/services/providerProfileService"
import { getUserById } from "@/services/userService"
import { getAllServicesByUserId } from "@/services/serviceService"
import { Mail, Phone, MapPin, User, Building2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceCard } from "@/components/provider/service-card"
import { Service, ServiceCategory } from "@/types/service"
import { ServiceBrowseCard } from "@/components/customer/service-browser"
import { getAllCategories } from "@/services/serviceCategoryService"
import { ServiceDetailModal } from "@/components/customer/service-detail-modal"

export default function ProviderDetail() {
    const params = useParams()
    const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId

    const [provider, setProvider] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [services, setServices] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedService, setSelectedService] = useState<Service | null>(null)
    const [categories, setCategories] = useState<ServiceCategory[]>([])
    const [bookingService, setBookingService] = useState<Service | null>(null);

    const itemsPerPage = 6

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return
            try {
                const [providerRes, userRes, servicesRes, categoriesRes] = await Promise.all([
                    getProviderProfileByUserId(userId),
                    getUserById(userId),
                    getAllServicesByUserId(userId),
                    getAllCategories(),
                ])

                setProvider(providerRes?.data)
                setUser(userRes.data)
                setServices(Array.isArray(servicesRes?.data) ? servicesRes.data : [])
                setCategories(categoriesRes?.data || [])
            } catch (err) {
                console.error("❌ Lỗi khi load provider detail:", err)
            }
        }

        fetchData()
    }, [userId])

    if (!provider || !user) {
        return <div className="p-10 text-gray-500">Loading provider info...</div>
    }

    const avatarUrl = user?.avatarUrl
        ? user.avatarUrl
        : user?.gender === "Male"
            ? "https://img.icons8.com/?size=100&id=NPW07SMh7Aco&format=png&color=000000"
            : user?.gender === "Female"
                ? "https://img.icons8.com/?size=100&id=6GNNJRTADGtC&format=png&color=000000"
                : "/default-avatar.png"

    const totalPages = Math.ceil((services?.length || 0) / itemsPerPage)
    const paginatedServices = Array.isArray(services)
        ? services.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : []

    return (
        <div className="max-w-6xl mx-auto py-12 px-6 space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-28 h-28 rounded-2xl border border-gray-200 object-cover shadow-sm"
                />
                <div className="space-y-3 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900">{user?.fullName}</h1>
                    <p className="text-gray-500">@{user?.username}</p>
                    <span
                        className={`inline-block text-xs px-3 py-1 rounded-full border font-medium ${user?.status === "Verified"
                            ? "border-green-400 text-green-600 bg-green-50"
                            : "border-gray-300 text-gray-600 bg-gray-50"
                            }`}
                    >
                        {user?.status}
                    </span>
                </div>
            </div>

            {/* Info sections */}
            <div className="space-y-10">
                <Section title="Thông tin cá nhân" icon={<User className="w-5 h-5 text-gray-600" />}>
                    <InfoItem icon={<Mail className="w-4 h-4 text-gray-400" />} label="Email" value={user?.email} />
                    <InfoItem icon={<Phone className="w-4 h-4 text-gray-400" />} label="Số điện thoại" value={user?.phoneNumber} />
                    <InfoItem icon={<MapPin className="w-4 h-4 text-gray-400" />} label="Địa chỉ" value={user?.address || "Chưa có"} />
                    <InfoItem
                        label="Giới tính"
                        value={
                            user?.gender === "Female"
                                ? "Nữ"
                                : user?.gender === "Male"
                                    ? "Nam"
                                    : user?.gender === "Other"
                                        ? "Không muốn tiết lộ"
                                        : "Chưa cập nhật"
                        }
                    />
                    {user?.bio && (
                        <div className="md:col-span-2">
                            <InfoItem icon={<FileText className="w-4 h-4 text-gray-400" />} label="Bio" value={user?.bio} />
                        </div>
                    )}
                </Section>

                <Section title="Thông tin doanh nghiệp" icon={<Building2 className="w-5 h-5 text-gray-600" />}>
                    <InfoItem label="Tên công ty" value={provider.companyName} />
                    <InfoItem label="Loại hình" value={provider.type} />
                    <InfoItem label="Địa chỉ" value={provider.address} />
                    <InfoItem label="Mã số thuế" value={provider.taxCode} />
                    <InfoItem label="Điện thoại DN" value={provider.businessPhone || "—"} />
                </Section>
            </div>

            {/* Services */}
            <Section title="Dịch vụ cung cấp">
                {services.length === 0 ? (
                    <p className="text-gray-500">Chưa có dịch vụ nào</p>
                ) : (
                    <>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            {paginatedServices.map((service) => (
                                <ServiceBrowseCard
                                    key={service.id}
                                    service={service}
                                    categories={categories}
                                    onViewDetails={() => {
                                        setSelectedService(service);
                                    }}
                                    onBook={() => {
                                        console.log("📌 Booking:", service.name);
                                    }}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                >
                                    Trước
                                </Button>
                                <span className="text-sm text-gray-600">
                                    Trang {currentPage}/{totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                >
                                    Sau
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </Section>

            {selectedService && (
                <ServiceDetailModal
                    service={selectedService}
                    currentUserId={userId}
                    onClose={() => setSelectedService(null)}
                    onBook={() => {
                        console.log("📌 Booking:", selectedService.name);
                        setSelectedService(null);
                    }}
                />
            )}
        </div>
    )
}

function Section({
    title,
    icon,
    children,
}: {
    title: string
    icon?: React.ReactNode
    children: React.ReactNode
}) {
    return (
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 tracking-tight">
                {icon && <span className="text-gray-600">{icon}</span>}
                {title}
            </h2>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">{children}</div>
        </div>
    );
}

function InfoItem({
    icon,
    label,
    value,
}: {
    icon?: React.ReactNode
    label: string
    value: string
}) {
    return (
        <div className="space-y-1">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase text-gray-500 tracking-wide">
                {icon && <span>{icon}</span>}
                {label}
            </p>
            <p className="text-base font-medium text-gray-900">{value}</p>
        </div>
    );
}
