"use client";
import { useEffect, useState } from "react";
import {
    getAllBookings,
    createBooking,
    updateBooking,
    deleteBooking,
} from "@/services/bookingService";
import {
    Button,
    Table,
    Modal,
    Input,
    DatePicker,
    Select,
    Space,
    notification,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Booking, CreateBookingDTO } from "@/types/booking";
import dayjs from "dayjs";

const { TextArea } = Input;

const AdminBookingManagementDashboard = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const res = await getAllBookings();
            setBookings(res.data ?? []);
        } catch (err) {
            notification.error({
                message: "Error",
                description: "Failed to load bookings",
            });
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<Booking> = [
        { title: "Service", dataIndex: "serviceTitle", key: "serviceTitle" },
        { title: "Customer", dataIndex: "customerName", key: "customerName" },
        { title: "Provider", dataIndex: "providerName", key: "providerName" },
        {
            title: "Booking Date",
            dataIndex: "bookingDate",
            render: (d) => dayjs(d).format("YYYY-MM-DD"),
        },
        {
            title: "Scheduled",
            render: (_, r) =>
                `${dayjs(r.scheduledDate).format("YYYY-MM-DD")} ${r.scheduledTime}`,
        },
        {
            title: "Price",
            dataIndex: "price",
            render: (p) => `$${p}`,
        },
        {
            title: "Payment",
            dataIndex: "paymentStatus",
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Booking Management</h2>
            </div>

            <Table
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={bookings}
                scroll={{ x: true }}
            />
        </div>
    );
};

export default AdminBookingManagementDashboard;
