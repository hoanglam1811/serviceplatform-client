"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Briefcase,
    Layers,
    CalendarCheck,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
    onNavigate: (page: string) => void;
    activePage: string;
}

export default function AdminSidebar({ onNavigate, activePage }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(true);

    const menuItems = [
        {
            id: "overview",
            label: "Overview & Approvals",
            icon: <LayoutDashboard size={20} />,
        },
        {
            id: "services",
            label: "Services",
            icon: <Briefcase size={20} />,
        },
        {
            id: "categories",
            label: "Categories",
            icon: <Layers size={20} />,
        },
        {
            id: "bookings",
            label: "Bookings",
            icon: <CalendarCheck size={20} />,
        },
    ];

    return (
        <motion.aside
            animate={{ width: isOpen ? 240 : 70 }}
            className="h-screen bg-card border-r shadow-sm flex flex-col"
        >
            {/* Toggle Button */}
            <div className="flex justify-end p-2">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsOpen(!isOpen)}
                    className="rounded-full"
                >
                    {isOpen ? <ChevronLeft /> : <ChevronRight />}
                </Button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 space-y-2 p-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition ${activePage === item.id
                                ? "bg-foreground text-white"
                                : "text-muted-foreground hover:bg-muted/50"
                            }`}
                    >
                        {item.icon}
                        {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                    </button>
                ))}
            </nav>
        </motion.aside>
    );
}
