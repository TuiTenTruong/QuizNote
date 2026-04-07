import Sidebar from "../../../components/layout/Sidebar";
import { studentNavItems, studentSettingsItems } from "./sidebarConfig";

interface StudentSidebarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const StudentSidebar = ({ isSidebarOpen, toggleSidebar }: StudentSidebarProps) => {
    return (
        <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            brandLink="/"
            navItems={studentNavItems}
            settingsItems={studentSettingsItems}
        />
    );
};

export default StudentSidebar;
