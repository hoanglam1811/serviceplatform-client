"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function UserProfileForm({ userData, onSave }: any) {
    const [form, setForm] = useState(userData);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white/80 p-6 rounded-2xl shadow-lg">
            <div>
                <label className="block text-sm font-medium">Họ và tên</label>
                <Input name="fullName" value={form.fullName || ""} onChange={handleChange} />
            </div>

            <div>
                <label className="block text-sm font-medium">Email</label>
                <Input name="email" type="email" value={form.email || ""} onChange={handleChange} />
            </div>

            <div>
                <label className="block text-sm font-medium">Số điện thoại</label>
                <Input name="phoneNumber" value={form.phoneNumber || ""} onChange={handleChange} />
            </div>

            <div>
                <label className="block text-sm font-medium">Địa chỉ</label>
                <Input name="address" value={form.address || ""} onChange={handleChange} />
            </div>

            <div>
                <label className="block text-sm font-medium">Giới thiệu bản thân</label>
                <Textarea name="bio" value={form.bio || ""} onChange={handleChange} />
            </div>

            <div>
                <label className="block text-sm font-medium">Ảnh đại diện (URL)</label>
                <Input name="avatarUrl" value={form.avatarUrl || ""} onChange={handleChange} />
                {form.avatarUrl && (
                    <img src={form.avatarUrl} alt="avatar" className="mt-2 w-20 h-20 rounded-full object-cover" />
                )}
            </div>

            <Button type="submit" className="w-full">Lưu thay đổi</Button>
        </form>
    );
}
