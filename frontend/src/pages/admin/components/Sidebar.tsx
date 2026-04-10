import Sidebar from "../../../components/layout/Sidebar";
import { adminNavItems, adminSettingsItems } from "../components/sidebarConfig";

interface AdminSidebarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const AdminSidebar = ({ isSidebarOpen, toggleSidebar }: AdminSidebarProps) => {
    return (
        <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            brandLink="/"
            navItems={adminNavItems}
            settingsItems={adminSettingsItems}
        />
    );
};

export default AdminSidebar;
