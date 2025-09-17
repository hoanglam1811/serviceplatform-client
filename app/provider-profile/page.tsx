"use client";
import { useEffect, useState } from "react";
import { getUserById, updateUser } from "@/services/userService";
import { getProviderProfileByUserId, updateProviderProfile } from "@/services/providerProfileService";
import { useAuth } from "@/contexts/auth-context";
import ProviderProfileForm from "./ProviderProfileForm";
import { notification } from "antd";

export default function ProviderProfile() {
    const { user } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    console.log(user)

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;
            try {
                const [userRes, providerRes] = await Promise.all([
                    getUserById(user.id),
                    getProviderProfileByUserId(user.id),
                ]);

                setUserData({
                    ...userRes.data,
                    ...providerRes,
                });
            } catch (err) {
                console.error("Error loading profile:", err);
                notification.error({
                    message: "Lỗi",
                    description: "Không thể tải thông tin hồ sơ",
                });
            }
        };

        fetchData();
    }, [user]);

    const handleUpdate = async (updatedData: any) => {
        try {
            if (!user?.id) return;

            const userDto = {
                id: user.id,
                fullName: updatedData.fullName,
                phoneNumber: updatedData.phoneNumber,
                address: updatedData.address,
                gender: updatedData.gender,
                bio: updatedData.bio,
                avatarUrl: updatedData.avatarUrl,
            };

            const providerDto = {
                id: updatedData.id,
                userId: user.id,
                companyName: updatedData.companyName,
                type: updatedData.type,
                taxCode: updatedData.taxCode,
                phoneNumber: updatedData.businessPhoneNumber,
                address: updatedData.businessAddress,
            };

            await Promise.all([
                updateUser(user.id, userDto),
                updateProviderProfile(providerDto),
            ]);

            notification.success({
                message: "Thành công",
                description: "Cập nhật thông tin hồ sơ thành công!",
            });

            setUserData(updatedData);
        } catch (err) {
            console.error(err);
            notification.error({
                message: "Lỗi",
                description: "Cập nhật thất bại, vui lòng thử lại.",
            });
        }
    };

    if (!userData) return <p className="text-center mt-10">Đang tải...</p>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <ProviderProfileForm userData={userData} onSave={handleUpdate} />
        </div>
    );
}
