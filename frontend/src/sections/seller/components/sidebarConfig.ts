import { FaHome, FaBook, FaShoppingCart, FaWallet, FaCog } from "react-icons/fa";
import { NavItem } from "../../../components/layout/Sidebar.types";

export const sellerNavItems: NavItem[] = [
    {
        path: "/seller",
        label: "Trang chu",
        icon: FaHome,
        end: true,
    },
    {
        path: "/seller/quizzes",
        label: "Mon hoc",
        icon: FaBook,
    },
    {
        path: "/seller/orders",
        label: "Don hang",
        icon: FaShoppingCart,
    },
    {
        path: "/seller/wallet",
        label: "Vi",
        icon: FaWallet,
    },
];

export const sellerSettingsItems: NavItem[] = [
    {
        path: "/seller/settings",
        label: "Cai dat",
        icon: FaCog,
    },
];
