import { IconType } from "react-icons";

export interface NavItem {
    path: string;
    label: string;
    icon: IconType;
    end?: boolean;
}

export interface SidebarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    brandLink?: string;
    navItems?: NavItem[];
    settingsItems?: NavItem[];
}
