import Sidebar from "../../../components/layout/Sidebar";
import { sellerNavItems, sellerSettingsItems } from "../sidebarConfig";

interface SellerSidebarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const SellerSidebar = ({ isSidebarOpen, toggleSidebar }: SellerSidebarProps) => {
    return (
        <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            brandLink="/seller"
            navItems={sellerNavItems}
            settingsItems={sellerSettingsItems}
        />
    );
};

export default SellerSidebar;
