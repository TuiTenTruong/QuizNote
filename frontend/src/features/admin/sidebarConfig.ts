import {
    FaHome,
    FaBook,
    FaUsers,
    FaShoppingCart,
    FaCog,
    FaShieldAlt,
    FaClock,
    FaGift
} from "react-icons/fa";
import { NavItem } from "../../components/layout/Sidebar.types";

export const adminNavItems: NavItem[] = [
    {
        path: "/admin",
        label: "Trang chủ",
        icon: FaHome,
        end: true
    },
    {
        path: "/admin/users",
        label: "Người dùng",
        icon: FaUsers
    },
    {
        path: "/admin/permissions",
        label: "Phân quyền",
        icon: FaShieldAlt
    },
    {
        path: "/admin/subjects",
        label: "Môn học",
        icon: FaBook
    },
    {
        path: "/admin/orders",
        label: "Đơn hàng",
        icon: FaShoppingCart
    },
    {
        path: "/admin/weekly-quizzes",
        label: "Weekly Quiz",
        icon: FaClock
    },
    {
        path: "/admin/rewards",
        label: "Rewards",
        icon: FaGift
    }
];

export const adminSettingsItems: NavItem[] = [
    {
        path: "/admin/settings",
        label: "Cài đặt",
        icon: FaCog
    }
];
