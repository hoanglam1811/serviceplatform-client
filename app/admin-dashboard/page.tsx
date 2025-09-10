"use client";

import React, { useState } from "react";
import AdminSidebar from "./sidebar";
import AdminOverviewDashboard from "./overview";
import AdminBookingManagementDashboard from "./booking";
import AdminServiceManagementDashboard from "./service";
import AdminServiceCategoriesManagementDashboard from "./serviceCategory";
import AdminCustomerManagement from "./customer";
import AdminProviderManagement from "./provider";

export default function AdminDashboard() {
    const [activePage, setActivePage] = useState("overview")
    return (
        <div className="flex">
            <AdminSidebar onNavigate={setActivePage} activePage={activePage} />

            <main className="flex-1 bg-background min-h-screen p-6">
                {activePage === "overview" && <AdminOverviewDashboard />}
                {activePage === "customers" && <AdminCustomerManagement />}
                {activePage === "providers" && <AdminProviderManagement />}
                {activePage === "services" && <AdminServiceManagementDashboard />}
                {activePage === "categories" && <AdminServiceCategoriesManagementDashboard />}
                {activePage === "bookings" && <AdminBookingManagementDashboard />}
            </main>
        </div>
    );
}

