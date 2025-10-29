import {
    Container,
    Row,
    Col,
    Button,
    Badge,
    Card,
    ProgressBar,
} from "react-bootstrap";
import {
    FaClock,
    FaBookOpen,
    FaStar,
    FaUser,
    FaChartLine,
    FaShoppingCart,
} from "react-icons/fa";
import "./StudentQuizDetail.scss";

const quiz = {
    title: "Phân loại động vật - Sinh học 7",
    thumbnail: "https://i.imgur.com/sbTQ0jR.jpg",
    author: "Nguyễn Văn A",
    authorAvatar: "https://i.imgur.com/hE5rD8D.png",
    description:
        "Ôn tập lại các kiến thức trọng tâm về phân loại động vật, cấu trúc cơ thể, các lớp động vật và đặc điểm sinh học cơ bản.",
    category: "Biology",
    difficulty: "Medium",
    time: "20 min",
    questions: 50,
    rating: 4.7,
    enrolled: 320,
    price: 49000,
    topScore: 98,
    sampleQuestions: [
        "Động vật không có xương sống thuộc nhóm nào?",
        "Động vật có hệ tuần hoàn kín là loài nào?",
        "Lớp bò sát gồm những loài nào dưới đây?",
        "Động vật máu lạnh là gì?",
    ],
    reviews: [
        { name: "Trần Minh", rating: 5, comment: "Câu hỏi hay và sát đề thi!", time: "2 ngày trước" },
        { name: "Lê Hoàng", rating: 4, comment: "Quiz khá ổn, nên thêm phần giải thích!", time: "1 tuần trước" },
    ],
};

function StudentQuizDetail() {
    return (
        <div className="student-quiz-detail">
            {/* HEADER BANNER */}
            <div
                className="quiz-banner"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.9)), url(${quiz.thumbnail})`,
                }}
            >
                <Container className="py-5 text-white">
                    <Row>
                        <Col md={8}>
                            <h2 className="fw-bold">{quiz.title}</h2>
                            <p className="text-light">{quiz.description}</p>
                            <div className="d-flex flex-wrap gap-3 mt-3 small text-white-50">
                                <span>
                                    <FaClock className="me-1" /> {quiz.time}
                                </span>
                                <span>
                                    <FaBookOpen className="me-1" /> {quiz.questions} câu hỏi
                                </span>
                                <span>
                                    <FaChartLine className="me-1" /> {quiz.difficulty}
                                </span>
                                <span>
                                    <FaUser className="me-1" /> {quiz.enrolled} học viên
                                </span>
                                <span className="text-warning">
                                    <FaStar className="me-1" /> {quiz.rating}
                                </span>
                            </div>
                        </Col>

                        <Col
                            md={4}
                            className="d-flex flex-column align-items-md-end justify-content-center mt-4 mt-md-0"
                        >
                            <h4 className="text-gradient fw-bold mb-2">
                                {quiz.price > 0
                                    ? `${quiz.price.toLocaleString("vi-VN")} ₫`
                                    : "Miễn phí"}
                            </h4>
                            <Button className="btn-gradient w-100">
                                {quiz.price > 0 ? (
                                    <>
                                        <FaShoppingCart className="me-2" /> Mua Quiz
                                    </>
                                ) : (
                                    "Bắt đầu làm bài"
                                )}
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container className="py-5">
                <Row className="gy-4">
                    {/* MAIN CONTENT */}
                    <Col lg={8}>
                        <Card className="bg-dark text-light border-0 shadow-sm p-4 mb-4">
                            <h5 className="fw-bold mb-3">Tổng quan quiz</h5>
                            <p className="text-secondary mb-0">{quiz.description}</p>
                        </Card>

                        <Card className="bg-dark text-light border-0 shadow-sm p-4 mb-4">
                            <h5 className="fw-bold mb-3">Câu hỏi mẫu</h5>
                            {quiz.sampleQuestions.map((q, i) => (
                                <div key={i} className="sample-question mb-3">
                                    <strong>{i + 1}. </strong> {q}
                                    <ProgressBar
                                        now={Math.random() * 100}
                                        variant="purple"
                                        className="mt-2"
                                    />
                                </div>
                            ))}
                        </Card>

                        <Card className="bg-dark text-light border-0 shadow-sm p-4">
                            <h5 className="fw-bold mb-3">Đánh giá từ học viên</h5>
                            {quiz.reviews.map((r, i) => (
                                <div key={i} className="review-item mb-3">
                                    <div className="d-flex justify-content-between">
                                        <h6 className="fw-semibold mb-1">{r.name}</h6>
                                        <span className="text-warning small">
                                            {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                                        </span>
                                    </div>
                                    <p className="text-secondary small mb-1">{r.comment}</p>
                                    <small className="text-muted">{r.time}</small>
                                    {i < quiz.reviews.length - 1 && <hr className="text-secondary opacity-25" />}
                                </div>
                            ))}
                        </Card>
                    </Col>

                    {/* SIDEBAR */}
                    <Col lg={4}>
                        <Card className="bg-dark text-light border-0 shadow-sm p-4 sticky-md-top">
                            <div className="d-flex align-items-center mb-3">
                                <img
                                    src={quiz.authorAvatar}
                                    alt="author"
                                    className="rounded-circle me-3"
                                    width={60}
                                    height={60}
                                />
                                <div>
                                    <h6 className="fw-bold mb-0">{quiz.author}</h6>
                                    <small className="text-secondary">Teacher</small>
                                </div>
                            </div>

                            <h6 className="fw-bold mb-2">Điểm cao nhất:</h6>
                            <h3 className="text-success fw-bold mb-3">{quiz.topScore}%</h3>

                            <div className="d-flex flex-column gap-2">
                                <Button variant="outline-light" className="w-100">
                                    Xem bảng xếp hạng
                                </Button>
                                <Button variant="outline-secondary" className="w-100">
                                    Lưu vào danh sách
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default StudentQuizDetail;
