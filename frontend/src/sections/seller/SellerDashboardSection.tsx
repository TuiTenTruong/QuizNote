import { Row, Col, Card, Button, Spinner, Alert, Badge } from "react-bootstrap";
import { FaMoneyBillWave, FaShoppingCart, FaStar, FaEye, FaChartBar } from "react-icons/fa";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSellerAnalyticsQuery } from "../../hooks/useAnalytic";
import { formatVND } from "../../hooks/useSeller";
import styles from "./scss/SellerDashboard.module.scss";

const SellerDashboardSection = () => {
    const user = useSelector((state: any) => state.user.account);
    const navigate = useNavigate();
    const { data: sellerAnalytics, loading, error, refetch } = useSellerAnalyticsQuery(user?.id);

    const stats = [
        {
            icon: <FaMoneyBillWave className="text-success" />,
            value: formatVND((sellerAnalytics as any)?.totalRevenue),
            label: "Tong doanh thu",
        },
        {
            icon: <FaShoppingCart className="text-primary" />,
            value: (sellerAnalytics as any)?.totalSubjects || 0,
            label: "Tong so mon hoc",
        },
        {
            icon: <FaStar className="text-warning" />,
            value: (sellerAnalytics as any)?.averageRating
                ? (sellerAnalytics as any).averageRating.toFixed(1)
                : "0.0",
            label: "Danh gia trung binh",
        },
        {
            icon: <FaEye className="text-info" />,
            value: (sellerAnalytics as any)?.totalViews || 0,
            label: "Tong luot xem",
        },
    ];

    const revenueData = (sellerAnalytics as any)?.monthlyRevenue || [];
    const orders = (sellerAnalytics as any)?.recentOrders || [];
    const quizzes = (sellerAnalytics as any)?.topSubjects || [];

    if (loading) {
        return (
            <div className={`${styles.sellerDashboard} d-flex justify-content-center align-items-center`} style={{ minHeight: "400px" }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.sellerDashboard}>
                <Alert variant="danger">
                    {error}
                    <Button
                        variant="outline-danger"
                        size="sm"
                        className="ms-3"
                        onClick={refetch}
                    >
                        Thu lai
                    </Button>
                </Alert>
            </div>
        );
    }

    return (
        <div className={styles.sellerDashboard}>
            <h3 className="fw-bold mb-2 text-gradient">Bang dieu khien nguoi ban</h3>
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

            <Card className="bg-secondary bg-opacity-10 p-4 mb-4">
                <div className="d-flex align-items-center mb-3">
                    <FaChartBar className="me-2 text-gradient" />
                    <h5 className="fw-semibold mb-0 text-white">Tong quan doanh thu</h5>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="month" stroke="#aaa" />
                        <YAxis stroke="#aaa" />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#222", border: "none", color: "#fff" }}
                            formatter={(value: any) => formatVND(value)}
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
                <Col lg={6}>
                    <Card className="bg-secondary bg-opacity-10 p-4 h-100">
                        <h5 className="fw-semibold mb-3 text-white">Don hang gan day</h5>
                        {orders.length > 0 ? (
                            <div className="d-flex flex-column gap-3">
                                {orders.map((order: any, index: number) => (
                                    <Card key={index} className="order-card p-3 bg-dark border-0">
                                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                                            <div>
                                                <h6 className="fw-semibold mb-1 text-white">{order.quizTitle || order.subjectName}</h6>
                                                <small className="text-white">Nguoi mua: {order.buyerName}</small>
                                            </div>
                                            <Badge bg={order.status === "Completed" ? "success" : "warning text-dark"}>
                                                {order.status}
                                            </Badge>
                                        </div>
                                        <div className="mt-2 text-end text-info fw-semibold">{formatVND(order.price)}</div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-secondary py-4">Chua co don hang gan day</div>
                        )}
                    </Card>
                </Col>

                <Col lg={6}>
                    <Card className="bg-secondary bg-opacity-10 p-4 h-100">
                        <h5 className="fw-semibold mb-3 text-white">Cac quiz cua toi</h5>
                        {quizzes.length > 0 ? (
                            <div className="d-flex flex-column gap-3">
                                {quizzes.map((quiz: any, index: number) => (
                                    <Card key={index} className="quiz-card p-3 bg-dark border-0">
                                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                                            <div>
                                                <h6 className="fw-semibold mb-1 text-white">{quiz.subjectName}</h6>
                                                <small className="text-white">{quiz.salesCount || 0} sales</small>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline-light"
                                                className="mt-2 mt-md-0"
                                                onClick={() => navigate(`/seller/quizzes/${quiz.subjectId}`)}
                                            >
                                                Xem
                                            </Button>
                                        </div>
                                        <div className="mt-2 text-end text-success fw-semibold">{formatVND(quiz.price)}</div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-secondary py-4">Chua co quiz nao duoc tao</div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SellerDashboardSection;
