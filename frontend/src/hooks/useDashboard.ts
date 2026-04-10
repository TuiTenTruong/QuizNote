import { useCallback, useState } from "react";

export const useSidebarState = (initialOpen: boolean = false) => {
    const [isSidebarOpen, setSidebarOpen] = useState(initialOpen);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen((prev) => !prev);
    }, []);

    return { isSidebarOpen, toggleSidebar, setSidebarOpen };
};

export const useDashboard = () => {
    const { isSidebarOpen, toggleSidebar } = useSidebarState(false);
    return { isSidebarOpen, toggleSidebar };
}