import { FaHome, FaBook, FaShoppingCart, FaWallet, FaCog } from "react-icons/fa";
import { NavItem } from "../../components/layout/Sidebar.types";

export const sellerNavItems: NavItem[] = [
    {
        path: "/seller",
        label: "Trang chủ",
        icon: FaHome,
        end: true
    },
    {
        path: "/seller/quizzes",
        label: "Môn học",
        icon: FaBook
    },
    {
        path: "/seller/orders",
        label: "Đơn hàng",
        icon: FaShoppingCart
    },
    {
        path: "/seller/wallet",
        label: "Ví",
        icon: FaWallet
    }
];

export const sellerSettingsItems: NavItem[] = [
    {
        path: "/seller/settings",
        label: "Cài đặt",
        icon: FaCog
    }
];
