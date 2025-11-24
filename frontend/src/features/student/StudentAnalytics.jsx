import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    Container,
    Row,
    Col,
    Card,
    Badge,
    Dropdown,
    Spinner,
    Alert,
} from "react-bootstrap";
import {
    FaBook,
    FaChartPie,
    FaCalendarCheck,
    FaClock,
} from "react-icons/fa";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import { getStudentAnalytics } from "../../services/apiService";
import "./StudentAnalytics.scss";

const StudentAnalytics = () => {
    const user = useSelector((state) => state.user.account);
    const [timeRange, setTimeRange] = useState("7");
    const [timeRangeLabel, setTimeRangeLabel] = useState("7 ngày qua");
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const COLORS = ["#9333ea", "#ec4899", "#f97316", "#22c55e", "#3b82f6", "#eab308"];

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange, user.id]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            const days = timeRange === "all" ? null : parseInt(timeRange);
            const response = await getStudentAnalytics(user.id, days);
            if (response && response.statusCode === 200) {
                setAnalytics(response.data);
            } else {
                setError(response.message || "Không thể tải dữ liệu phân tích. Vui lòng thử lại sau.");
            }

        } catch (err) {
            console.error("Error fetching analytics:", err);
            setError("Không thể tải dữ liệu phân tích. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    const handleTimeRangeChange = (value, label) => {
        setTimeRange(value);
        setTimeRangeLabel(label);
    };

    const formatTime = (seconds) => {
        if (!seconds) return "0 phút";
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    if (loading) {
        return (
            <div className="student-analytics bg-black text-light min-vh-100 py-4">
                <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                    <Spinner animation="border" variant="primary" />
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div className="student-analytics bg-black text-light min-vh-100 py-4">
                <Container fluid>
                    <Alert variant="danger">{error}</Alert>
                </Container>
            </div>
        );
    }

    return (
        <div className="student-analytics bg-black text-light min-vh-100 py-4">
            <Container fluid>
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <h4 className="fw-bold m-0">Phân tích kết quả học tập</h4>
                    <Dropdown>
                        <Dropdown.Toggle variant="outline-light">
                            {timeRangeLabel}
                        </Dropdown.Toggle>
                        <Dropdown.Menu variant="dark">
                            <Dropdown.Item onClick={() => handleTimeRangeChange("7", "7 ngày qua")}>
                                7 ngày qua
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleTimeRangeChange("30", "30 ngày qua")}>
                                30 ngày qua
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleTimeRangeChange("all", "Tất cả thời gian")}>
                                Tất cả thời gian
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                {/* Tổng quan nhanh */}
                <Row className="g-3 mb-4">
                    <Col md={3}>
                        <Card className="bg-dark border-secondary p-3 text-center">
                            <FaBook size={28} className="text-primary mb-2" />
                            <h5 className="fw-semibold text-white">{analytics?.totalQuizzesCompleted || 0}</h5>
                            <p className="text-secondary small mb-0">Quiz đã hoàn thành</p>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="bg-dark border-secondary p-3 text-center">
                            <FaChartPie size={28} className="text-info mb-2" />
                            <h5 className="fw-semibold text-white">
                                {analytics?.averageAccuracy ? `${analytics.averageAccuracy.toFixed(1)}%` : '0%'}
                            </h5>
                            <p className="text-secondary small mb-0">Tỉ lệ đúng trung bình</p>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="bg-dark border-secondary p-3 text-center">
                            <FaCalendarCheck size={28} className="text-success mb-2" />
                            <h5 className="fw-semibold text-white">{analytics?.activeDays || 0}</h5>
                            <p className="text-secondary small mb-0">Ngày hoạt động</p>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="bg-dark border-secondary p-3 text-center">
                            <FaClock size={28} className="text-warning mb-2" />
                            <h5 className="fw-semibold text-white">{formatTime(analytics?.totalTimeSpent)}</h5>
                            <p className="text-secondary small mb-0">Thời gian học</p>
                        </Card>
                    </Col>
                </Row>

                {/* Biểu đồ */}
                <Row className="g-4">
                    <Col md={6}>
                        <Card className="bg-dark border-secondary p-3 h-100">
                            <h6 className="fw-bold mb-3 text-light">Phân bố quiz theo môn học</h6>
                            {analytics?.subjectStats?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie
                                            data={analytics.subjectStats.map(s => ({ name: s.subjectName, value: s.count }))}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) =>
                                                `${name}: ${(percent * 100).toFixed(0)}%`
                                            }
                                            outerRadius={90}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {analytics.subjectStats.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }}
                                            labelStyle={{ color: '#fff' }}
                                            itemStyle={{
                                                color: 'var(--bs-secondary)'
                                            }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-center text-secondary py-5">
                                    Chưa có dữ liệu
                                </div>
                            )}
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="bg-dark border-secondary p-3 h-100">
                            <h6 className="fw-bold mb-3 text-light">Tỉ lệ đúng theo môn học</h6>
                            {analytics?.accuracyBySubject?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart
                                        data={analytics.accuracyBySubject.map(s => ({
                                            subject: s.subjectName,
                                            correct: s.accuracy
                                        }))}
                                        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis dataKey="subject" stroke="#aaa" />
                                        <YAxis stroke="#aaa" domain={[0, 10]} />
                                        <Tooltip
                                            contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }}
                                            labelStyle={{ color: '#fff' }}
                                            itemStyle={{
                                                color: 'var(--bs-secondary)'
                                            }}
                                        />
                                        <Bar dataKey="correct" fill="url(#colorUv)" radius={[6, 6, 0, 0]} />
                                        <defs>
                                            <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#9333ea" />
                                                <stop offset="100%" stopColor="#f97316" />
                                            </linearGradient>
                                        </defs>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-center text-secondary py-5">
                                    Chưa có dữ liệu
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>

                {/* Hoạt động gần đây */}
                <Card className="bg-dark border-secondary p-3 mt-4">
                    <h6 className="fw-bold mb-3">Hoạt động gần đây</h6>
                    {analytics?.recentActivity?.length > 0 ? (
                        analytics.recentActivity.slice(0, 10).map((activity, idx) => (
                            <div
                                key={idx}
                                className="d-flex justify-content-between align-items-center border-bottom border-secondary py-2"
                            >
                                <div>
                                    <h6 className="mb-0 fw-semibold">
                                        {activity.quizCount} quiz hoàn thành
                                    </h6>
                                    <p className="text-secondary small mb-0">
                                        Điểm trung bình: {activity.avgScore?.toFixed(1)}đ
                                    </p>
                                </div>
                                <Badge bg="secondary">
                                    {new Date(activity.date).toLocaleDateString("vi-VN")}
                                </Badge>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-secondary py-3">
                            Chưa có hoạt động nào
                        </div>
                    )}
                </Card>
            </Container>
        </div>
    );
};

export default StudentAnalytics;
