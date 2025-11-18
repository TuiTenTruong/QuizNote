import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const isAuthenticated = useSelector(state => state.user?.isauthenticated);
    const userRole = useSelector(state => state.user?.account?.role?.name);

    // Kiểm tra xem user đã đăng nhập chưa
    if (!isAuthenticated) {
        // Chưa đăng nhập -> redirect về trang login
        return <Navigate to="/login" replace />;
    }
    console.log("User role:", userRole);
    console.log("Allowed roles:", allowedRoles);
    // Kiểm tra role nếu có yêu cầu
    if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(userRole)) {
            // Không có quyền truy cập -> redirect về trang chủ
            return <Navigate to="/" replace />;
        }
    }

    // Đã đăng nhập và có quyền -> render component
    return children;
};

export default ProtectedRoute;
