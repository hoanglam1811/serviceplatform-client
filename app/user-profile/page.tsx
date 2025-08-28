"use client";
import { useEffect, useState } from "react";
import { getUserById, updateUser } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";
import UserProfileForm from "./UserProfileForm";
import { useAuth } from "@/contexts/auth-context";

export default function UserProfile() {
    const { user } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    const { toast } = useToast();
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
        <div className="p-6 max-w-6xl mx-auto">
            <UserProfileForm userData={userData} onSave={handleUpdate} />
        </div>
    );
}
