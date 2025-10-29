import { Container, Row, Col, Card, Button, Table, ProgressBar, Badge } from "react-bootstrap";
import {
    FaClock,
    FaUserGraduate,
    FaTrophy,
    FaEdit,
    FaShareAlt,
    FaEye,
    FaMoneyBillWave,
    FaShoppingCart,
    FaChartBar,
    FaTrash,
} from "react-icons/fa";
import "./SellerQuizDetail.scss";

const quizDetail = {
    id: 1,
    title: "Phân loại động vật – Bộ câu hỏi trắc nghiệm Sinh học 7",
    description: "Bộ 100 câu trắc nghiệm luyện thi, có đáp án chi tiết, giúp học sinh nắm vững phần phân loại động vật.",
    price: 49000,
    totalPurchases: 128,
    totalRevenue: 6272000,
    avgScore: 84.3,
    topScore: 98,
    avgCompletionTime: "15:32",
    recentBuyers: [
        { buyer: "Nguyễn Văn A", email: "vana@example.com", date: "2 giờ trước" },
        { buyer: "Trần Thị B", email: "btran@example.com", date: "5 giờ trước" },
        { buyer: "Phạm Quốc C", email: "cpham@example.com", date: "1 ngày trước" },
    ],
    performance: [
        { question: "1. Động vật không xương sống là gì?", correctRate: 95 },
        { question: "2. Côn trùng có mấy đôi cánh?", correctRate: 87 },
        { question: "3. Động vật nào là máu lạnh?", correctRate: 80 },
        { question: "4. Sự tiến hóa là gì?", correctRate: 76 },
        { question: "5. Lớp bò sát khác lớp lưỡng cư ở điểm nào?", correctRate: 83 },
    ],
};

function SellerQuizDetail() {
    const q = quizDetail;

    return (
        <div className="seller-quiz-detail">
            <Container fluid="sm">
                {/* HEADER */}
                <div className="d-flex flex-wrap justify-content-between align-items-start mb-4 gap-2">
                    <div>
                        <h3 className="fw-bold text-gradient mb-1">{q.title}</h3>
                        <p className="text-secondary">{q.description}</p>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                        <Button variant="outline-light" size="sm">
                            <FaEdit className="me-1" /> Edit
                        </Button>
                        <Button variant="outline-light" size="sm">
                            <FaShareAlt className="me-1" /> Share
                        </Button>
                        <Button variant="danger" size="sm">
                            <FaTrash className="me-1" /> Delete
                        </Button>
                        <Button variant="primary" className="btn-gradient" size="sm">
                            <FaEye className="me-1" /> Preview
                        </Button>
                    </div>
                </div>

                {/* STATS */}
                <Row className="g-3 mb-4">
                    <Col xs={6} md={3}>
                        <Card className="stat-card bg-dark border-0 text-center p-3 shadow-sm">
                            <FaShoppingCart className="icon text-info mb-2" />
                            <h4 className="fw-bold text-white">{q.totalPurchases}</h4>
                            <p className="text-secondary small mb-0">Total Purchases</p>
                        </Card>
                    </Col>
                    <Col xs={6} md={3}>
                        <Card className="stat-card bg-dark border-0 text-center p-3 shadow-sm">
                            <FaMoneyBillWave className="icon text-success mb-2" />
                            <h4 className="fw-bold text-white">{q.totalRevenue.toLocaleString("vi-VN")} ₫</h4>
                            <p className="text-secondary small mb-0">Total Revenue</p>
                        </Card>
                    </Col>
                    <Col xs={6} md={3}>
                        <Card className="stat-card bg-dark border-0 text-center p-3 shadow-sm">
                            <FaClock className="icon text-warning mb-2" />
                            <h4 className="fw-bold text-white">{q.avgCompletionTime}</h4>
                            <p className="text-secondary small mb-0">Avg. Completion Time</p>
                        </Card>
                    </Col>
                    <Col xs={6} md={3}>
                        <Card className="stat-card bg-dark border-0 text-center p-3 shadow-sm">
                            <FaTrophy className="icon text-danger mb-2" />
                            <h4 className="fw-bold text-white">{q.topScore}%</h4>
                            <p className="text-secondary small mb-0">Top Score</p>
                        </Card>
                    </Col>
                </Row>

                {/* RECENT BUYERS & PERFORMANCE */}
                <Row className="g-4 mb-4">
                    <Col xs={12} lg={7}>
                        <Card className="bg-dark border-0 p-3 shadow-sm h-100">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="fw-semibold text-white mb-0">Recent Buyers</h6>
                                <Button variant="outline-light" size="sm">
                                    View All
                                </Button>
                            </div>
                            <Table borderless variant="dark" className="align-middle mb-0">
                                <thead>
                                    <tr className="text-secondary small">
                                        <th>Buyer</th>
                                        <th>Email</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {q.recentBuyers.map((b, i) => (
                                        <tr key={i}>
                                            <td>{b.buyer}</td>
                                            <td>{b.email}</td>
                                            <td>{b.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>

                    <Col xs={12} lg={5}>
                        <Card className="bg-dark border-0 p-3 shadow-sm h-100">
                            <h6 className="fw-semibold text-white mb-3">Question Performance</h6>
                            {q.performance.map((p, i) => (
                                <div key={i} className="mb-2">
                                    <p className="small text-light mb-1">{p.question}</p>
                                    <ProgressBar
                                        now={p.correctRate}
                                        label={`${p.correctRate}%`}
                                        className="progress-custom"
                                    />
                                </div>
                            ))}
                        </Card>
                    </Col>
                </Row>

                {/* SHARE QUIZ */}
                <Card className="bg-dark border-0 p-3 shadow-sm d-flex justify-content-between align-items-center flex-wrap">
                    <div className="text-light mb-2 mb-md-0">
                        <strong>Giá bán:</strong> <span className="text-gradient fw-bold">{q.price.toLocaleString("vi-VN")} ₫</span>
                        <Badge bg="secondary" className="ms-2">Public</Badge>
                    </div>
                    <Button className="btn-gradient" size="sm">
                        <FaShareAlt className="me-2" /> Share Quiz
                    </Button>
                </Card>
            </Container>
        </div>
    );
}

export default SellerQuizDetail;
