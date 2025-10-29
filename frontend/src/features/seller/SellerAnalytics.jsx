import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import {
    FaMoneyBillWave,
    FaBookOpen,
    FaUserGraduate,
    FaChartLine,
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


const monthlyRevenue = [
    { month: "Jan", revenue: 4.2 },
    { month: "Feb", revenue: 5.1 },
    { month: "Mar", revenue: 6.8 },
    { month: "Apr", revenue: 5.9 },
    { month: "May", revenue: 7.3 },
    { month: "Jun", revenue: 6.1 },
    { month: "Jul", revenue: 7.9 },
    { month: "Aug", revenue: 8.4 },
    { month: "Sep", revenue: 7.6 },
    { month: "Oct", revenue: 9.1 },
];

const topQuizzes = [
    { title: "Biology Basics", sales: 128 },
    { title: "Advanced Math", sales: 96 },
    { title: "Chemistry Mastery", sales: 74 },
    { title: "Physics Quiz Set", sales: 63 },
    { title: "English Grammar", sales: 55 },
];
import './SellerAnalytics.scss'
function SellerAnalytics() {
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
                        <h5 className="fw-bold text-white">₫7.2M</h5>
                        <p className="text-secondary small mb-1">Total Revenue</p>
                        <Badge bg="success">+12.5%</Badge>
                    </Card>
                </Col>

                <Col xs={12} md={3}>
                    <Card className="stat-card text-center p-3 bg-dark border-0 shadow-sm">
                        <FaBookOpen className="icon text-info mb-2" />
                        <h5 className="fw-bold text-white">24</h5>
                        <p className="text-secondary small mb-1">Quizzes Sold</p>
                        <Badge bg="info">+8%</Badge>
                    </Card>
                </Col>

                <Col xs={12} md={3}>
                    <Card className="stat-card text-center p-3 bg-dark border-0 shadow-sm">
                        <FaUserGraduate className="icon text-warning mb-2" />
                        <h5 className="fw-bold text-white">312</h5>
                        <p className="text-secondary small mb-1">Active Students</p>
                        <Badge bg="warning" text="dark">
                            +5%
                        </Badge>
                    </Card>
                </Col>

                <Col xs={12} md={3}>
                    <Card className="stat-card text-center p-3 bg-dark border-0 shadow-sm">
                        <FaChartLine className="icon text-danger mb-2" />
                        <h5 className="fw-bold text-white">72%</h5>
                        <p className="text-secondary small mb-1">Completion Rate</p>
                        <Badge bg="danger">-2%</Badge>
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
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                                <XAxis dataKey="month" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip
                                    contentStyle={{
                                        background: "#111",
                                        border: "1px solid #333",
                                        color: "#fff",
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
                    </Card>
                </Col>

                <Col xs={12} lg={4}>
                    <Card className="chart-card bg-dark border-0 p-3 shadow-sm">
                        <h6 className="fw-semibold mb-3 text-white">Top Selling Quizzes</h6>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={topQuizzes} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis
                                    type="category"
                                    dataKey="title"
                                    width={110}
                                    stroke="#aaa"
                                    tick={{ fill: "#ccc" }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: "#111",
                                        border: "1px solid #333",
                                        color: "#fff",
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
                    </Card>
                </Col>
            </Row>

        </div>
    );
}

export default SellerAnalytics;
