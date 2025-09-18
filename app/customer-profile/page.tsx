"use client";
import { useEffect, useState } from "react";
import { getUserById, updateUser } from "@/services/userService";
import UserProfileForm from "./CustomerProfileForm";
import { useAuth } from "@/contexts/auth-context";
import { notification } from "antd";

export default function CustomerProfile() {
    const { user } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    console.log(user)

    useEffect(() => {
        if (user?.id) {
            getUserById(user.id).then((result) => setUserData(result.data));
        }
    }, [user]);

    const handleUpdate = async (updatedData: any) => {
        try {
            if (!user?.id) return;
            await updateUser(user?.id, updatedData);
            notification.success({
                message: "Thành công",
                description: "Cập nhật thông tin thành công!",
            });
            setUserData(updatedData);
        } catch (err) {
            notification.success({
                message: "Lỗi",
                description: "Cập nhật thất bại!",
            });
            console.error(err);
        }
    };

    if (!userData) return <p className="text-center mt-10">Đang tải...</p>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <UserProfileForm userData={userData} onSave={handleUpdate} />
        </div>
    );
}
