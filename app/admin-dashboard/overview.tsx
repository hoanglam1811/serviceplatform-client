"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { acceptUser, getAllCustomers, getAllServiceProviders, rejectUser } from "@/services/authService";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AdminSidebar from "./sidebar";
import { notification } from "antd";

type UserItem = {
    id: string;
    username: string;
    fullName: string;
    role: string;
    avatarUrl?: string | null;
    email: string;
    phoneNumber?: string | null;
    gender?: string | null;
    nationalId?: any;
    address?: string | null;
    bio?: string | null;
    status?: string;
    createdAt?: string | null;
    updatedAt?: string | null;
};

export default function AdminOverviewDashboard() {
    const [customers, setCustomers] = useState<UserItem[]>([]);
    const [providers, setProviders] = useState<UserItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"customers" | "providers">("customers");
    const [query, setQuery] = useState("");
    const [processingId, setProcessingId] = useState<string | null>(null);

    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [selectedUser, setSelectedUser] = useState<{ id: string; role: "Customer" | "Provider" } | null>(null);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const currentList = activeTab === "customers" ? customers : providers;

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = currentList.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(currentList.length / usersPerPage);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const resCust = await getAllCustomers();
                const resProv = await getAllServiceProviders();

                setCustomers(resCust?.data ?? []);
                setProviders(resProv?.data ?? []);
            } catch (err) {
                console.error(err);
                notification.error({
                    message: "Error",
                    description: "Failed to load users.",
                });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const pendingCustomers = useMemo(
        () => customers.filter((u) => (u.status ?? "").toLowerCase() === "pending"),
        [customers]
    );

    const pendingProviders = useMemo(
        () =>
            providers.filter(
                (u) =>
                    (u.status ?? "").toLowerCase() === "pending" ||
                    (u.status ?? "").toLowerCase() === "unverified"
            ),
        [providers]
    );

    const filteredList = useMemo(() => {
        const list = activeTab === "customers" ? pendingCustomers : pendingProviders;
        if (!query.trim()) return list;
        const q = query.toLowerCase();
        return list.filter(
            (u) =>
                (u.fullName ?? "").toLowerCase().includes(q) ||
                (u.username ?? "").toLowerCase().includes(q) ||
                (u.email ?? "").toLowerCase().includes(q) ||
                (u.phoneNumber ?? "").toLowerCase().includes(q)
        );
    }, [activeTab, pendingCustomers, pendingProviders, query]);

    // approve
    const updateUserStatus = async (id: string, role: "Customer" | "Provider") => {
        try {
            setProcessingId(id);
            const resp = await acceptUser(id, role);

            setCustomers((prev) =>
                prev.map((p) => (p.id === id ? { ...p, status: "Verified" } : p))
            );
            setProviders((prev) =>
                prev.map((p) => (p.id === id ? { ...p, status: "Verified" } : p))
            );

            notification.success({
                message: "Approved",
                description: "User approved successfully. They will be notified.",
            });

            return resp.data;
        } catch (err: any) {
            console.error(err);
            notification.error({
                message: "Error",
                description: "Failed to update status. Try again.",
            });
            throw err;
        } finally {
            setProcessingId(null);
        }
    };

    const handleOpenApprove = (user: any) => {
        setSelectedUser(user);
        setIsApproveModalOpen(true);
    };

    const approveUser = async (id: string, role: "Customer" | "Provider") => {
        await updateUserStatus(id, role);
        setCustomers((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, status: "Verified" } : p
            )
        );
        setProviders((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, status: "Verified" } : p
            )
        );
        notification.success({
            message: "Approved",
            description: "User has been approved successfully.",
        });
        setIsApproveModalOpen(false);
    };

    const handleReject = (id: string, role: "Customer" | "Provider") => {
        setSelectedUser({ id, role });
        setRejectReason("");
        setIsRejectModalOpen(true);
    };

    return (
        <div className="p-6">
            <div className="max-w-full mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-sm text-muted-foreground">
                            Overview & account approvals
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center space-x-2">
                            <Input
                                placeholder="Search name, username, email or phone..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-72"
                            />
                            <Button variant="ghost" onClick={() => setQuery("")}>
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Pending Customers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">{pendingCustomers.length}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                                Waiting for approval
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Pending Providers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">{pendingProviders.length}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                                Service providers to review
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">All Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {customers.length + providers.length}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                Total customers + providers
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setActiveTab("customers")}
                        className={`px-4 py-2 rounded-lg font-medium ${activeTab === "customers"
                            ? "bg-foreground text-white"
                            : "bg-muted/60"
                            }`}
                    >
                        Customers
                        <span className="ml-2 text-xs text-muted-foreground">
                            ({pendingCustomers.length})
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab("providers")}
                        className={`px-4 py-2 rounded-lg font-medium ${activeTab === "providers"
                            ? "bg-foreground text-white"
                            : "bg-muted/60"
                            }`}
                    >
                        Providers
                        <span className="ml-2 text-xs text-muted-foreground">
                            ({pendingProviders.length})
                        </span>
                    </button>
                </div>

                {/* Table */}
                <div className="bg-card rounded-lg shadow-sm">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold">Pending Accounts</h2>
                        <p className="text-sm text-muted-foreground">
                            Danh sách các tài khoản chờ phê duyệt
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead className="text-left text-sm text-muted-foreground border-b">
                                <tr>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Gender</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Registered</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="p-6 text-center">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : filteredList.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-6 text-center">
                                            No pending accounts.
                                        </td>
                                    </tr>
                                ) : (
                                    currentUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-muted/50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                                        {u.avatarUrl ? (
                                                            <img
                                                                src={u.avatarUrl}
                                                                alt={u.fullName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="uppercase text-sm">
                                                                {(u.fullName ||
                                                                    u.username ||
                                                                    "U"
                                                                ).charAt(0)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {u.fullName}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            @{u.username}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3 text-sm">{u.email}</td>
                                            <td className="px-4 py-3 text-sm">
                                                {u.phoneNumber ?? "-"}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {u.gender ?? "-"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={
                                                        u.status?.toLowerCase() ===
                                                            "pending"
                                                            ? "outline"
                                                            : "secondary"
                                                    }
                                                >
                                                    {u.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {u.createdAt
                                                    ? new Date(
                                                        u.createdAt
                                                    ).toLocaleDateString()
                                                    : "-"}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="default"
                                                                    size="sm"
                                                                    onClick={() => handleOpenApprove(u)}
                                                                >
                                                                    Approve
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Chấp nhận tài khoản này</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>


                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleReject(
                                                                            u.id,
                                                                            u.role as
                                                                            | "Customer"
                                                                            | "Provider"
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        processingId === u.id
                                                                    }

                                                                >
                                                                    Reject
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Từ chối tài khoản này</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        <div className="flex justify-center items-center gap-2 mt-4 mb-3">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                            >
                                Prev
                            </Button>
                            <span className="text-sm">
                                Page {currentPage} / {totalPages || 1}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                            >
                                Next
                            </Button>
                        </div>

                        <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Approve User</DialogTitle>
                                    <DialogDescription>
                                        Bạn có chắc chắn muốn approve user này không?
                                    </DialogDescription>
                                </DialogHeader>

                                <DialogFooter>
                                    <Button variant="ghost" onClick={() => setIsApproveModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={async () => {
                                            if (!selectedUser) return;
                                            await approveUser(selectedUser.id, selectedUser.role);
                                        }}
                                    >
                                        Confirm Approve
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Reject Modal */}
                        <Dialog
                            open={isRejectModalOpen}
                            onOpenChange={setIsRejectModalOpen}
                        >
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Reject User</DialogTitle>
                                    <DialogDescription>
                                        Vui lòng nhập lý do từ chối để gửi cho
                                        user.
                                    </DialogDescription>
                                </DialogHeader>

                                <Textarea
                                    value={rejectReason}
                                    onChange={(e) =>
                                        setRejectReason(e.target.value)
                                    }
                                    placeholder="Nhập lý do..."
                                    className="mt-3"
                                />

                                <DialogFooter>
                                    <Button
                                        variant="ghost"
                                        onClick={() =>
                                            setIsRejectModalOpen(false)
                                        }
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={async () => {
                                            if (!selectedUser) return;
                                            await rejectUser(
                                                selectedUser.id,
                                                selectedUser.role,
                                                rejectReason
                                            );
                                            // update local state
                                            setCustomers((prev) =>
                                                prev.map((p) =>
                                                    p.id === selectedUser.id
                                                        ? {
                                                            ...p,
                                                            status: "Rejected",
                                                        }
                                                        : p
                                                )
                                            );
                                            setProviders((prev) =>
                                                prev.map((p) =>
                                                    p.id === selectedUser.id
                                                        ? {
                                                            ...p,
                                                            status: "Rejected",
                                                        }
                                                        : p
                                                )
                                            );
                                            toast({
                                                title: "Rejected",
                                                description:
                                                    "User has been rejected and notified.",
                                            });
                                            setIsRejectModalOpen(false);
                                        }}
                                    >
                                        Confirm Reject
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
}