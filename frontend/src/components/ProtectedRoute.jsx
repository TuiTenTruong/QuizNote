import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const isAuthenticated = useSelector(state => state.user?.isauthenticated);
    const userRole = useSelector(state => state.user?.account?.role?.name);

    // Kiểm tra xem user đã đăng nhập chưa
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    console.log("User role:", userRole);
    console.log("Allowed roles:", allowedRoles);
    // Kiểm tra role nếu có yêu cầu
    if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(userRole)) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
