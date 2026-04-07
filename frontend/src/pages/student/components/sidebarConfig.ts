import { FaHome, FaShoppingCart, FaChartLine, FaWallet, FaCog, FaCalendarAlt } from "react-icons/fa";
import { NavItem } from "../../../components/layout/Sidebar.types";

export const studentNavItems: NavItem[] = [
    {
        path: "/student",
        label: "Trang Chủ",
        icon: FaHome,
        end: true
    },
    {
        path: "/student/quizzes/my",
        label: "Quiz của tôi",
        icon: FaShoppingCart
    },
    {
        path: "/student/weekly-quiz",
        label: "Weekly Quiz",
        icon: FaCalendarAlt
    },
    {
        path: "/student/history",
        label: "Lịch sử",
        icon: FaChartLine
    },
    {
        path: "/student/analytics",
        label: "Phân tích",
        icon: FaWallet
    }
];

export const studentSettingsItems: NavItem[] = [
    {
        path: "/student/settings",
        label: "Cài đặt",
        icon: FaCog
    }
];
