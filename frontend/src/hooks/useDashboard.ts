import { useState } from "react";

export const useDashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };
    return { isSidebarOpen, toggleSidebar };
}