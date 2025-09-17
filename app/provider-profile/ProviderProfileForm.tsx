"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Camera, IdCard, Settings, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProviderProfileForm({ userData, onSave }: any) {
    const [form, setForm] = useState(userData);
    console.log(userData)

    const handleChange = (field: string, value: string) => {
        setForm((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <div className="relative p-6 space-y-8">
            {/* Avatar */}
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative group">
                    <img
                        src={form.avatarUrl || "/default-avatar.png"}
                        alt="avatar"
                        className="w-24 h-24 rounded-full border-2 border-gray-200 shadow-md object-cover transition group-hover:opacity-80"
                    />
                    {/* Upload button */}
                    <label className="absolute bottom-0 right-0 bg-black p-2 rounded-full cursor-pointer shadow-md transform transition hover:scale-105">
                        <Camera className="w-4 h-4 text-white" />
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const url = URL.createObjectURL(file);
                                    setForm({ ...form, avatarUrl: url });
                                }
                            }}
                        />
                    </label>
                </div>
                <div>
                    <h2 className="text-xl font-semibold">{form.fullName}</h2>
                    <p className="text-gray-500">{form.email}</p>
                </div>
            </div>

            {/* Section: Thông tin cá nhân */}
            <div className="p-6 space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <User className="w-5 h-5 text-blue-500" /> Thông tin cá nhân
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-muted-foreground mb-1">
                            Username
                        </label>
                        <Input
                            disabled
                            value={form.username}
                            onChange={(e) => handleChange("username", e.target.value)}
                            placeholder="Tên đăng nhập"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-muted-foreground mb-1">
                            Email
                        </label>
                        <Input
                            disabled
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="Email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-muted-foreground mb-1">
                            Họ tên
                        </label>
                        <Input
                            value={form.fullName}
                            onChange={(e: any) => handleChange("fullName", e.target.value)}
                            placeholder="Họ tên"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-muted-foreground mb-1">
                            Số điện thoại
                        </label>
                        <Input
                            value={form.phoneNumber}
                            onChange={(e) => handleChange("phoneNumber", e.target.value)}
                            placeholder="Số điện thoại"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-muted-foreground mb-1">
                            Địa chỉ
                        </label>
                        <Input
                            value={form.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            placeholder="Địa chỉ"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-muted-foreground mb-1">
                            Giới tính
                        </label>
                        <Select
                            value={form.gender ?? ""}
                            onValueChange={(v) => handleChange("gender", v)}
                        >
                            <SelectTrigger className="rounded-xl w-full">
                                <SelectValue placeholder="Chọn giới tính" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Nam</SelectItem>
                                <SelectItem value="Female">Nữ</SelectItem>
                                <SelectItem value="Other">Khác</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Textarea
                    value={form.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    placeholder="Mô tả bản thân"
                />
            </div>

            <div className="p-6 space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <IdCard className="w-5 h-5 text-green-500" /> Giấy tờ tùy thân
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {(form.nationalId?.split(",") || []).map((url: string, idx: number) => (
                        <img
                            key={idx}
                            src={url.trim()}
                            alt={`National ID ${idx + 1}`}
                            className="rounded-xl border shadow-sm w-full h-[250px] object-cover"
                        />
                    ))}
                </div>

                <div className="p-6 space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                        <Building2 className="w-5 h-5 text-orange-500" /> Thông tin doanh nghiệp
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-muted-foreground mb-1">
                                Tên công ty
                            </label>
                            <Input
                                value={form.companyName}
                                onChange={(e) => handleChange("companyName", e.target.value)}
                                placeholder="Nhập tên công ty"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-muted-foreground mb-1">
                                Loại hình
                            </label>
                            <Input
                                value={form.type}
                                onChange={(e) => handleChange("type", e.target.value)}
                                placeholder="VD: Cá nhân / Doanh nghiệp"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-muted-foreground mb-1">
                                Mã số thuế
                            </label>
                            <Input
                                value={form.taxCode}
                                onChange={(e) => handleChange("taxCode", e.target.value)}
                                placeholder="Mã số thuế"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-muted-foreground mb-1">
                                Số điện thoại doanh nghiệp
                            </label>
                            <Input
                                value={form.businessPhoneNumber}
                                onChange={(e) => handleChange("businessPhoneNumber", e.target.value)}
                                placeholder="Số điện thoại công ty"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                        <Settings className="w-5 h-5 text-purple-500" /> Thông tin hệ thống
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-500">Trạng thái</label>
                            <p className="font-bold">{form.status}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Vai trò</label>
                            <p className="font-bold">{form.role}</p>
                        </div>
                    </div>
                </div>

                {/* Floating Save Button */}
                <div className="flex justify-end">
                    <Button
                        onClick={handleSubmit}
                        className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition"
                    >
                        💾 Lưu thay đổi
                    </Button>
                </div>
            </div>
        </div>
    );
}
