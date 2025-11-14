import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Spinner } from "react-bootstrap";
import {
    FaMoneyBillWave,
    FaBookOpen,
    FaUserGraduate,
    FaChartLine,
    FaStar,
    FaEye,
} from "react-icons/fa";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { useSelector } from "react-redux";
import { getSellerAnalytics } from "../../services/apiService";
import './SellerAnalytics.scss';

function SellerAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [months, setMonths] = useState(10);
    const seller = useSelector((state) => state.user.account);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getSellerAnalytics(seller.id, months);
                if (response.data && response.data.data) {
                    setAnalytics(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching analytics:", error);
                setError("Failed to load analytics. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (seller?.id) {
            fetchAnalytics();
        }
    }, [seller?.id, months]);

    // Format revenue data for chart (convert to millions)
    const monthlyRevenueData = analytics?.monthlyRevenue?.map(item => ({
        month: item.month,
        revenue: (item.revenue / 1000000).toFixed(2), // Convert to millions
        salesCount: item.salesCount
    })) || [];

    // Format top subjects for chart
    const topSubjectsData = analytics?.topSubjects?.slice(0, 5).map(item => ({
        title: item.subjectName,
        sales: item.salesCount,
        rating: item.rating
    })) || [];

    if (loading) {
        return (
            <div className="seller-analytics text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="text-secondary mt-3">Loading analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="seller-analytics">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="seller-analytics">
            <h3 className="fw-bold mb-2 text-gradient">Analytics Overview</h3>
            <p className="text-secondary mb-4">
                Track your quiz sales performance and revenue growth.
            </p>

            {/* SUMMARY CARDS */}
            <Row className="g-3 mb-4">
                <Col xs={12} md={3}>
                    <Card className="stat-card text-center bg-dark p-3 shadow-sm border-black">
                        <FaMoneyBillWave className="icon text-success mb-2" />
                        <h5 className="fw-bold text-white">
                            ₫{analytics?.totalRevenue?.toLocaleString("vi-VN") || "0"}
                        </h5>
                        <p className="text-secondary small mb-1">Total Revenue</p>
                        {analytics?.pendingBalance > 0 && (
                            <Badge bg="warning" text="dark">
                                Pending: ₫{analytics.pendingBalance.toLocaleString("vi-VN")}
                            </Badge>
                        )}
                    </Card>
                </Col>

                <Col xs={12} md={3}>
                    <Card className="stat-card text-center p-3 bg-dark border-0 shadow-sm">
                        <FaBookOpen className="icon text-info mb-2" />
                        <h5 className="fw-bold text-white">{analytics?.totalQuizzesSold || 0}</h5>
                        <p className="text-secondary small mb-1">Quizzes Sold</p>
                        <Badge bg="info">{analytics?.totalSubjects || 0} Subjects</Badge>
                    </Card>
                </Col>

                <Col xs={12} md={3}>
                    <Card className="stat-card text-center p-3 bg-dark border-0 shadow-sm">
                        <FaStar className="icon text-warning mb-2" />
                        <h5 className="fw-bold text-white">
                            {analytics?.averageRating?.toFixed(1) || "0.0"}
                        </h5>
                        <p className="text-secondary small mb-1">Average Rating</p>
                        <Badge bg="warning" text="dark">
                            ⭐ {analytics?.averageRating?.toFixed(1) || "0.0"}/5
                        </Badge>
                    </Card>
                </Col>

                <Col xs={12} md={3}>
                    <Card className="stat-card text-center p-3 bg-dark border-0 shadow-sm">
                        <FaEye className="icon text-danger mb-2" />
                        <h5 className="fw-bold text-white">{analytics?.totalViews?.toLocaleString("vi-VN") || 0}</h5>
                        <p className="text-secondary small mb-1">Total Views</p>
                        <Badge bg="danger">Views</Badge>
                    </Card>
                </Col>
            </Row>

            {/* CHART SECTION */}
            <Row className="g-4">
                <Col xs={12} lg={8}>
                    <Card className="chart-card bg-dark border-0 p-3 shadow-sm">
                        <h6 className="fw-semibold mb-3 text-white">
                            Monthly Revenue (Millions ₫)
                        </h6>
                        {monthlyRevenueData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <LineChart data={monthlyRevenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                                    <XAxis dataKey="month" stroke="#888" />
                                    <YAxis stroke="#888" />
                                    <Tooltip
                                        contentStyle={{
                                            background: "#111",
                                            border: "1px solid #333",
                                            color: "#fff",
                                        }}
                                        formatter={(value, name) => {
                                            if (name === "revenue") return [`₫${value}M`, "Revenue"];
                                            if (name === "salesCount") return [value, "Sales"];
                                            return [value, name];
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#9333ea"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: "#f97316" }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center text-secondary py-5">
                                No revenue data available
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={12} lg={4}>
                    <Card className="chart-card bg-dark border-0 p-3 shadow-sm">
                        <h6 className="fw-semibold mb-3 text-white">Top Selling Subjects</h6>
                        {topSubjectsData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={topSubjectsData} layout="vertical" margin={{ left: 20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis
                                        type="category"
                                        dataKey="title"
                                        width={110}
                                        stroke="#aaa"
                                        tick={{ fill: "#ccc", fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: "#111",
                                            border: "1px solid #333",
                                            color: "#fff",
                                        }}
                                        formatter={(value, name) => {
                                            if (name === "sales") return [value, "Sales"];
                                            if (name === "rating") return [value, "Rating"];
                                            return [value, name];
                                        }}
                                    />
                                    <Bar dataKey="sales" fill="url(#colorGradient)" radius={[6, 6, 6, 6]} />
                                    <defs>
                                        <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#9333ea" />
                                            <stop offset="100%" stopColor="#f97316" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center text-secondary py-5">
                                No subjects data available
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* RECENT ORDERS SECTION */}
            {analytics?.recentOrders && analytics.recentOrders.length > 0 && (
                <Row className="g-4 mt-2">
                    <Col xs={12}>
                        <Card className="bg-dark border-0 p-3 shadow-sm">
                            <h6 className="fw-semibold mb-3 text-white">Recent Orders</h6>
                            <div className="table-responsive">
                                <table className="table table-dark table-hover">
                                    <thead>
                                        <tr>
                                            <th>Buyer</th>
                                            <th>Subject</th>
                                            <th>Price</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analytics.recentOrders.map((order) => (
                                            <tr key={order.purchaseId}>
                                                <td>{order.buyerName}</td>
                                                <td>{order.subjectName}</td>
                                                <td>₫{order.price.toLocaleString("vi-VN")}</td>
                                                <td>
                                                    {new Date(order.purchasedAt).toLocaleDateString("vi-VN", {
                                                        year: "numeric",
                                                        month: "2-digit",
                                                        day: "2-digit"
                                                    })}
                                                </td>
                                                <td>
                                                    <Badge
                                                        bg={
                                                            order.status === "Completed"
                                                                ? "success"
                                                                : order.status === "Pending"
                                                                    ? "warning"
                                                                    : "danger"
                                                        }
                                                    >
                                                        {order.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default SellerAnalytics;
