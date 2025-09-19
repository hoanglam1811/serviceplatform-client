import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, MapPin, IdCard, Settings } from "lucide-react"

interface ProviderProfileDialogProps {
    open: boolean
    onClose: () => void
    provider: any
}

export function ProviderProfileDialog({ open, onClose, provider }: ProviderProfileDialogProps) {
    if (!provider) return null

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl max-h-[85vh] rounded-lg p-0 overflow-hidden flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 shadow-2xl">
                {/* Header */}
                <DialogHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-8 py-6 border-b">
                    <DialogTitle className="text-2xl font-bold text-center text-gray-800 tracking-tight">
                        Hồ sơ Provider
                    </DialogTitle>
                </DialogHeader>

                {/* Body scrollable */}
                <div className="flex-1 overflow-y-auto px-10 py-8 space-y-10 custom-scrollbar">
                    {/* Avatar + Basic Info */}
                    <div className="flex items-center gap-10">
                        <img
                            src={provider.avatarUrl || "/default-avatar.png"}
                            alt="avatar"
                            className="w-36 h-36 rounded-2xl border-4 border-indigo-100 shadow-lg object-cover"
                        />
                        <div className="space-y-3">
                            <h2 className="text-2xl font-semibold text-gray-900">{provider.fullName}</h2>
                            <p className="text-gray-500">@{provider.username}</p>
                            <span className="inline-block text-sm px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                                {provider.status}
                            </span>
                        </div>
                    </div>

                    {/* Thông tin cá nhân */}
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="flex items-center gap-2 text-xl font-semibold text-indigo-600">
                            <User className="w-5 h-5" /> Thông tin cá nhân
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <InfoItem icon={<Mail className="w-4 h-4" />} label="Email" value={provider.email} />
                            <InfoItem icon={<Phone className="w-4 h-4" />} label="Số điện thoại" value={provider.phoneNumber} />
                            <InfoItem icon={<MapPin className="w-4 h-4" />} label="Địa chỉ" value={provider.address || "Chưa có"} />
                            <InfoItem label="Giới tính" value={provider.gender || "Chưa cập nhật"} />
                        </div>
                        {provider.bio && (
                            <p className="text-gray-600 italic mt-2 border-l-4 border-indigo-200 pl-4">
                                <InfoItem label="Bio" value={provider.bio || "Chưa cập nhật"} />
                            </p>
                        )}
                    </div>

                    {/* Giấy tờ */}
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="flex items-center gap-2 text-xl font-semibold text-emerald-600">
                            <IdCard className="w-5 h-5" /> Giấy tờ tùy thân
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 place-items-center">
                            {(provider.nationalId?.split(",") || []).map((url: string, idx: number) => (
                                <div
                                    key={idx}
                                    className="relative group rounded-2xl overflow-hidden shadow-md border hover:shadow-lg transition"
                                >
                                    <img
                                        src={url.trim()}
                                        alt={`National ID ${idx + 1}`}
                                        className="w-[360px] h-[240px] object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                                        ID {idx + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white/90 backdrop-blur-md px-10 py-5 border-t flex justify-end">
                    <Button
                        onClick={onClose}
                        className="rounded-xl bg-gradient-to-r from-black to-gray-800 text-white px-10 py-3 shadow-md hover:shadow-lg hover:scale-105 transition"
                    >
                        Đóng
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function InfoItem({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
    return (
        <div className="space-y-1">
            <p className="flex items-center gap-1 text-sm font-medium text-gray-500">
                {icon} {label}
            </p>
            <p className="font-semibold text-gray-800">{value}</p>
        </div>
    )
}
