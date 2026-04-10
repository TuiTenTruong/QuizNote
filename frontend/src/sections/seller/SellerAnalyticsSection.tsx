import { Row, Col, Card, Badge, Spinner } from "react-bootstrap";
import { FaMoneyBillWave, FaBookOpen, FaStar, FaEye } from "react-icons/fa";
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
import { useSellerAnalyticsQuery } from "../../hooks/useAnalytic";
import styles from "./scss/SellerAnalytics.module.scss";

const SellerAnalyticsSection = () => {
    const seller = useSelector((state: any) => state.user.account);
    const { data: analytics, loading, error } = useSellerAnalyticsQuery(seller?.id);

    const monthlyRevenueData = analytics?.monthlyRevenue?.map((item: any) => ({
        month: item.month,
        revenue: Number((item.revenue / 1000000).toFixed(2)),
    })) || [];

    const topSubjectsData = analytics?.topSubjects?.slice(0, 5).map((item: any) => ({
        title: item.subjectName,
        sales: item.salesCount,
    })) || [];

    if (loading) {
        return (
            <div className={`${styles.sellerAnalytics} text-center py-5`}>
                <Spinner animation="border" variant="primary" />
                <p className="text-secondary mt-3">Dang tai thong ke...</p>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className={styles.sellerAnalytics}>
            <h3 className="fw-bold mb-2 text-gradient">Tong quan thong ke</h3>
            <p className="text-secondary mb-4">Theo doi hieu suat ban quiz va doanh thu.</p>

            <Row className="g-3 mb-4">
                <Col xs={12} md={3}>
                    <Card className="stat-card text-center bg-dark p-3 shadow-sm border-black">
                        <FaMoneyBillWave className="icon text-success mb-2" />
                        <h5 className="fw-bold text-white">{analytics?.totalRevenue?.toLocaleString("vi-VN") || 0} VND</h5>
                        <p className="text-secondary small mb-1">Tong doanh thu</p>
                    </Card>
                </Col>
                <Col xs={12} md={3}>
                    <Card className="stat-card text-center p-3 bg-dark border-0 shadow-sm">
                        <FaBookOpen className="icon text-info mb-2" />
                        <h5 className="fw-bold text-white">{analytics?.totalQuizzesSold || 0}</h5>
                        <p className="text-secondary small mb-1">So quiz da ban</p>
                    </Card>
                </Col>
                <Col xs={12} md={3}>
                    <Card className="stat-card text-center p-3 bg-dark border-0 shadow-sm">
                        <FaStar className="icon text-warning mb-2" />
                        <h5 className="fw-bold text-white">{analytics?.averageRating?.toFixed(1) || "0.0"}</h5>
                        <p className="text-secondary small mb-1">Danh gia trung binh</p>
                        <Badge bg="warning" text="dark">Rating</Badge>
                    </Card>
                </Col>
                <Col xs={12} md={3}>
                    <Card className="stat-card text-center p-3 bg-dark border-0 shadow-sm">
                        <FaEye className="icon text-danger mb-2" />
                        <h5 className="fw-bold text-white">{analytics?.totalViews?.toLocaleString("vi-VN") || 0}</h5>
                        <p className="text-secondary small mb-1">Tong luot xem</p>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                <Col xs={12} lg={8}>
                    <Card className="chart-card bg-dark border-0 p-3 shadow-sm">
                        <h6 className="fw-semibold mb-3 text-white">Doanh thu theo thang</h6>
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={monthlyRevenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                                <XAxis dataKey="month" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip />
                                <Line type="monotone" dataKey="revenue" stroke="#9333ea" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={12} lg={4}>
                    <Card className="chart-card bg-dark border-0 p-3 shadow-sm">
                        <h6 className="fw-semibold mb-3 text-white">Mon hoc ban chay</h6>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={topSubjectsData} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="title" width={110} stroke="#aaa" tick={{ fill: "#ccc", fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="sales" fill="#9333ea" radius={[6, 6, 6, 6]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SellerAnalyticsSection;
