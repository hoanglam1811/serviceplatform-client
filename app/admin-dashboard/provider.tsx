"use client"

import { useEffect, useMemo, useState } from "react"
import { getAllUsers } from "@/services/userService"
import { Badge, Button, Input, notification } from "antd"

export default function AdminProviderManagement() {
    const [providers, setProviders] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState("")

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                const allUsers = await getAllUsers()
                setProviders(allUsers.data.filter((u: any) => u.role === "Provider"))
            } catch (err) {
                console.error(err)
                notification.error({
                    message: "Error",
                    description: "Failed to load providers.",
                })
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const filteredProviders = useMemo(() => {
        if (!query.trim()) return providers
        const q = query.toLowerCase()
        return providers.filter(
            (u) =>
                (u.fullName ?? "").toLowerCase().includes(q) ||
                (u.username ?? "").toLowerCase().includes(q) ||
                (u.email ?? "").toLowerCase().includes(q) ||
                (u.phoneNumber ?? "").toLowerCase().includes(q)
        )
    }, [providers, query])

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Provider Management</h1>

            <div className="flex items-center gap-3">
                <Input
                    placeholder="Search provider..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ width: 300 }}
                />
                <Button onClick={() => setQuery("")}>Clear</Button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full table-auto">
                    <thead className="border-b text-left">
                        <tr>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-6 text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : filteredProviders.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-6 text-center">
                                    No providers found.
                                </td>
                            </tr>
                        ) : (
                            filteredProviders.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{u.fullName ?? u.username}</td>
                                    <td className="px-4 py-3">{u.email}</td>
                                    <td className="px-4 py-3">{u.phoneNumber ?? "-"}</td>
                                    <td className="px-4 py-3">
                                        <Badge status={u.status === "Verified" ? "success" : "processing"} text={u.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        {u.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
