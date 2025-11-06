import { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Badge,
    Dropdown,
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
import "./StudentAnalytics.scss";

const StudentAnalytics = () => {
    // Giả dữ liệu thống kê
    const [timeRange, setTimeRange] = useState("7 ngày qua");

    const quizStats = [
        { name: "Hệ điều hành", value: 5 },
        { name: "Cơ sở dữ liệu", value: 3 },
        { name: "Toán rời rạc", value: 2 },
        { name: "Mạng máy tính", value: 4 },
    ];

    const accuracyData = [
        { subject: "Hệ điều hành", correct: 85 },
        { subject: "CSDL", correct: 78 },
        { subject: "Toán rời rạc", correct: 92 },
        { subject: "Mạng", correct: 68 },
    ];

    const COLORS = ["#9333ea", "#ec4899", "#f97316", "#22c55e"];

    return (
        <div className="student-analytics bg-black text-light min-vh-100 py-4">
            <Container fluid>
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <h4 className="fw-bold m-0">Phân tích kết quả học tập</h4>
                    <Dropdown>
                        <Dropdown.Toggle variant="outline-light">
                            {timeRange}
                        </Dropdown.Toggle>
                        <Dropdown.Menu variant="dark">
                            <Dropdown.Item onClick={() => setTimeRange("7 ngày qua")}>
                                7 ngày qua
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setTimeRange("30 ngày qua")}>
                                30 ngày qua
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setTimeRange("Tất cả thời gian")}>
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
                            <h5 className="fw-semibold">14</h5>
                            <p className="text-secondary small mb-0">Quiz đã hoàn thành</p>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="bg-dark border-secondary p-3 text-center">
                            <FaChartPie size={28} className="text-info mb-2" />
                            <h5 className="fw-semibold">80%</h5>
                            <p className="text-secondary small mb-0">Tỉ lệ đúng trung bình</p>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="bg-dark border-secondary p-3 text-center">
                            <FaCalendarCheck size={28} className="text-success mb-2" />
                            <h5 className="fw-semibold">12</h5>
                            <p className="text-secondary small mb-0">Ngày hoạt động</p>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="bg-dark border-secondary p-3 text-center">
                            <FaClock size={28} className="text-warning mb-2" />
                            <h5 className="fw-semibold">6h 20m</h5>
                            <p className="text-secondary small mb-0">Thời gian học</p>
                        </Card>
                    </Col>
                </Row>

                {/* Biểu đồ */}
                <Row className="g-4">
                    <Col md={6}>
                        <Card className="bg-dark border-secondary p-3 h-100">
                            <h6 className="fw-bold mb-3 text-light">Phân bố quiz theo môn học</h6>
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie
                                        data={quizStats}
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
                                        {quizStats.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: "#1f1f1f", border: "none" }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="bg-dark border-secondary p-3 h-100">
                            <h6 className="fw-bold mb-3 text-light">Tỉ lệ đúng theo môn học</h6>
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={accuracyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="subject" stroke="#aaa" />
                                    <YAxis stroke="#aaa" domain={[0, 100]} />
                                    <Tooltip contentStyle={{ background: "#1f1f1f", border: "none" }} />
                                    <Bar dataKey="correct" fill="url(#colorUv)" radius={[6, 6, 0, 0]} />
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#9333ea" />
                                            <stop offset="100%" stopColor="#f97316" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>
                </Row>

                {/* Gần đây */}
                <Card className="bg-dark border-secondary p-3 mt-4">
                    <h6 className="fw-bold mb-3">Hoạt động gần đây</h6>
                    {[
                        { title: "Hệ điều hành", date: "2025-10-28", type: "Thi chính thức" },
                        { title: "Cơ sở dữ liệu", date: "2025-10-27", type: "Luyện tập" },
                        { title: "Toán rời rạc", date: "2025-10-26", type: "Luyện tập" },
                    ].map((a, idx) => (
                        <div
                            key={idx}
                            className="d-flex justify-content-between align-items-center border-bottom border-secondary py-2"
                        >
                            <div>
                                <h6 className="mb-0 fw-semibold">{a.title}</h6>
                                <p className="text-secondary small mb-0">{a.type}</p>
                            </div>
                            <Badge bg="secondary">
                                {new Date(a.date).toLocaleDateString("vi-VN")}
                            </Badge>
                        </div>
                    ))}
                </Card>
            </Container>
        </div>
    );
};

export default StudentAnalytics;
