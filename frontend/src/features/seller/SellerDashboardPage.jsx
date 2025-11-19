import { Container, Row, Col, Card, Table, Button, Spinner, Alert } from "react-bootstrap";
import {
    FaMoneyBillWave,
    FaShoppingCart,
    FaStar,
    FaEye,
    FaChartBar,
} from "react-icons/fa";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import "./SellerDashboard.scss";
import { Badge } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getSellerAnalytics } from "../../services/apiService";
import { useSelector } from "react-redux";

// Format currency to VNĐ with commas
const formatVND = (value) => {
    if (!value) return "0đ";
    return `${parseInt(value).toLocaleString('vi-VN')}đ`;
};

const SellerDashboard = () => {
    const [sellerAnalytics, setSellerAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useSelector(state => state.user.account);

    useEffect(() => {
        if (user?.id) {
            fetchSellerAnalytics();
        }
    }, [user]);

    const fetchSellerAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getSellerAnalytics(user.id);
            const data = response.data;
            console.log(data);
            setSellerAnalytics(data);
        } catch (error) {
            console.error("Error fetching seller analytics:", error);
            setError("Failed to load analytics data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Stats data
    const stats = [
        {
            icon: <FaMoneyBillWave className="text-success" />,
            value: formatVND(sellerAnalytics?.totalRevenue),
            label: "Total Revenue",
        },
        {
            icon: <FaShoppingCart className="text-primary" />,
            value: sellerAnalytics?.totalSubjects || 0,
            label: "Total Subjects",
        },
        {
            icon: <FaStar className="text-warning" />,
            value: sellerAnalytics?.averageRating
                ? sellerAnalytics.averageRating.toFixed(1)
                : "0.0",
            label: "Average Rating",
        },
        {
            icon: <FaEye className="text-info" />,
            value: sellerAnalytics?.totalViews || 0,
            label: "Total Views",
        },
    ];

    // Revenue chart data
    const revenueData = sellerAnalytics?.monthlyRevenue || [
        { month: "Jan", revenue: 0 },
        { month: "Feb", revenue: 0 },
        { month: "Mar", revenue: 0 },
        { month: "Apr", revenue: 0 },
        { month: "May", revenue: 0 },
        { month: "Jun", revenue: 0 },
    ];

    // Recent orders
    const orders = sellerAnalytics?.recentOrders || [];

    // My quizzes
    const quizzes = sellerAnalytics?.topSubjects || [];

    if (loading) {
        return (
            <div className="seller-dashboard d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="seller-dashboard">
                <Alert variant="danger">
                    {error}
                    <Button
                        variant="outline-danger"
                        size="sm"
                        className="ms-3"
                        onClick={fetchSellerAnalytics}
                    >
                        Retry
                    </Button>
                </Alert>
            </div>
        );
    }

    return (


        <div className="seller-dashboard ">
            <h3 className="fw-bold mb-2 text-gradient">Seller Dashboard</h3>
            {/* STATS CARDS */}
            <Row className="g-3 mb-4">
                {stats.map((item, i) => (
                    <Col xs={6} md={3} key={i}>
                        <Card className="stat-card text-center p-3">
                            <div className="fs-3 mb-2">{item.icon}</div>
                            <h5 className="fw-bold">{item.value}</h5>
                            <small className="text-secondary">{item.label}</small>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* REVENUE CHART */}
            <Card className="bg-secondary bg-opacity-10 p-4 mb-4">
                <div className="d-flex align-items-center mb-3">
                    <FaChartBar className="me-2 text-gradient" />
                    <h5 className="fw-semibold mb-0 text-white">Revenue Overview</h5>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="month" stroke="#aaa" />
                        <YAxis stroke="#aaa" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#222",
                                border: "none",
                                color: "#fff",
                            }}
                            formatter={(value) => formatVND(value)}
                        />
                        <Bar dataKey="revenue" fill="url(#grad)" radius={[6, 6, 0, 0]} />
                        <defs>
                            <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#9333ea" />
                                <stop offset="100%" stopColor="#f97316" />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Row className="g-4">
                {/* RECENT ORDERS */}
                <Col lg={6}>
                    <Card className="bg-secondary bg-opacity-10 p-4 h-100">
                        <h5 className="fw-semibold mb-3 text-white">Recent Orders</h5>
                        {orders.length > 0 ? (
                            <div className="d-flex flex-column gap-3">
                                {orders.map((order, index) => (
                                    <Card key={index} className="order-card p-3 bg-dark border-0">
                                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                                            <div>
                                                <h6 className="fw-semibold mb-1 text-white">
                                                    {order.quizTitle || order.quiz}
                                                </h6>
                                                <small className="text-white">
                                                    Buyer: {order.buyerName} • {order.purchasedAt}
                                                </small>
                                            </div>
                                            <Badge
                                                bg={
                                                    order.status === "Completed"
                                                        ? "success"
                                                        : "warning text-dark"
                                                }
                                            >
                                                {order.status}
                                            </Badge>
                                        </div>
                                        <div className="mt-2 text-end text-info fw-semibold">
                                            {formatVND(order.price)}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-secondary py-4">
                                No recent orders yet
                            </div>
                        )}
                    </Card>
                </Col>

                {/* MY QUIZZES */}
                <Col lg={6}>
                    <Card className="bg-secondary bg-opacity-10 p-4 h-100">
                        <h5 className="fw-semibold mb-3 text-white">My Quizzes</h5>
                        {quizzes.length > 0 ? (
                            <div className="d-flex flex-column gap-3">
                                {quizzes.map((quiz, index) => (
                                    <Card key={index} className="quiz-card p-3 bg-dark border-0">
                                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                                            <div>
                                                <h6 className="fw-semibold mb-1 text-white">{quiz.subjectName}</h6>
                                                <small className="text-white">
                                                    {quiz.salesCount || 0} sales • ⭐ {quiz.rating.toFixed(1) || 0}
                                                </small>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline-light"
                                                className="mt-2 mt-md-0"
                                            >
                                                View
                                            </Button>
                                        </div>
                                        <div className="mt-2 text-end text-success fw-semibold">
                                            {formatVND(quiz.price)}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-secondary py-4">
                                No quizzes created yet
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default SellerDashboard;
