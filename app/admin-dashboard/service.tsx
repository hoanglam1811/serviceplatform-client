"use client";
import { useEffect, useState } from "react";
import { getAllServices } from "@/services/serviceService";
import { Table, notification, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Service } from "@/types/service";
import dayjs from "dayjs";

const AdminServiceManagementDashboard = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            setLoading(true);
            const res = await getAllServices();
            setServices(res.data ?? []);
        } catch (err) {
            notification.error({
                message: "Error",
                description: "Failed to load services",
            });
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<Service> = [
        { title: "Title", dataIndex: "title", key: "title" },
        { title: "Description", dataIndex: "description", key: "description" },
        { title: "Provider", dataIndex: "providerName", key: "providerName" },
        { title: "Type", dataIndex: "type", key: "type" },
        { title: "Service Area", dataIndex: "serviceArea", key: "serviceArea" },
        {
            title: "Price",
            dataIndex: "originalPrice",
            render: (p, r) =>
                r.discountPrice && r.discountPrice > 0 ? (
                    <span>
                        <span className="line-through mr-2">${p}</span>
                        <span className="font-bold">${r.discountPrice}</span>
                    </span>
                ) : (
                    `$${p}`
                ),
        },
        {
            title: "Duration",
            dataIndex: "duration",
            render: (d) => `${d} mins`,
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            render: (d) => dayjs(d).format("YYYY-MM-DD"),
        },
        {
            title: "Updated At",
            dataIndex: "updatedAt",
            render: (d) => dayjs(d).format("YYYY-MM-DD"),
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (s) =>
                s === "active" ? (
                    <Tag color="green">Active</Tag>
                ) : (
                    <Tag color="red">Inactive</Tag>
                ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Service Management</h2>
            </div>

            <Table
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={services}
                scroll={{ x: true }}
            />
        </div>
    );
};

export default AdminServiceManagementDashboard;
