"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserById, updateUser } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";
import UserProfileForm from "./UserProfileForm";

export default function UserProfile() {
    const user = useSelector((state: RootState) => state.token.user);
    const [userData, setUserData] = useState<any>(null);
    const { toast } = useToast()

    useEffect(() => {
        if (user?.id) {
            getUserById(user.id).then(setUserData);
        }
    }, [user]);

    const handleUpdate = async (updatedData: any) => {
        try {
            await updateUser(user.id, updatedData);
            toast({
                title: "Thành công",
                description: "Cập nhật thông tin thành công!",
            });
            setUserData(updatedData);
        } catch (err) {
            toast({
                title: "Lỗi",
                description: "Cập nhật thất bại!",
                variant: "destructive",
            });
            console.error(err);
        }
    };


    if (!userData) return <p className="text-center mt-10">Đang tải...</p>;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Thông tin cá nhân</h1>
            <UserProfileForm userData={userData} onSave={handleUpdate} />
        </div>
    );
}
