import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
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
const stats = [
    { icon: <FaMoneyBillWave />, label: "Total Revenue", value: "2,340,000 VND" },
    { icon: <FaShoppingCart />, label: "Quizzes Sold", value: "28" },
    { icon: <FaStar />, label: "Avg. Rating", value: "4.8 / 5" },
    { icon: <FaEye />, label: "Total Views", value: "1,205" },
];

const orders = [
    { buyer: "Minh Tran", quiz: "Sinh học 12 HK1", price: "50,000 VND", date: "18 Oct", status: "Completed" },
    { buyer: "Lan Pham", quiz: "Luyện thi Y Dược", price: "70,000 VND", date: "17 Oct", status: "Pending" },
    { buyer: "An Nguyen", quiz: "Toán Cao Cấp", price: "30,000 VND", date: "16 Oct", status: "Completed" },
];

const quizzes = [
    { title: "Toán Đại Cương", price: "40,000 VND", sales: 12, rating: 4.8 },
    { title: "Hóa Hữu Cơ", price: "30,000 VND", sales: 9, rating: 4.6 },
    { title: "Sinh học 12 HK1", price: "50,000 VND", sales: 15, rating: 4.9 },
];

const revenueData = [
    { month: "Jun", revenue: 1200000 },
    { month: "Jul", revenue: 1800000 },
    { month: "Aug", revenue: 2400000 },
    { month: "Sep", revenue: 2200000 },
    { month: "Oct", revenue: 2600000 },
];

const SellerDashboard = () => {
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
                        <div className="d-flex flex-column gap-3">
                            {orders.map((order, index) => (
                                <Card key={index} className="order-card p-3 bg-dark border-0">
                                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                                        <div>
                                            <h6 className="fw-semibold mb-1 text-white">{order.quiz}</h6>
                                            <small className="text-white">
                                                Buyer: {order.buyer} • {order.date}
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
                                        {order.price}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Card>
                </Col>

                {/* MY QUIZZES */}
                <Col lg={6}>
                    <Card className="bg-secondary bg-opacity-10 p-4 h-100">
                        <h5 className="fw-semibold mb-3 text-white">My Quizzes</h5>
                        <div className="d-flex flex-column gap-3">
                            {quizzes.map((quiz, index) => (
                                <Card key={index} className="quiz-card p-3 bg-dark border-0">
                                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                                        <div>
                                            <h6 className="fw-semibold mb-1 text-white">{quiz.title}</h6>
                                            <small className="text-white">
                                                {quiz.sales} sales • ⭐ {quiz.rating}
                                            </small>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline-light"
                                            className="mt-2 mt-md-0"
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                    <div className="mt-2 text-end text-success fw-semibold">
                                        {quiz.price}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default SellerDashboard;
