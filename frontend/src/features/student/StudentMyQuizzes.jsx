import { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
} from "react-bootstrap";
import { FaSearch, FaBook } from "react-icons/fa";
import "./StudentMyQuizzes.scss";
import { fetchMyQuizzes } from "../../services/apiService";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosCustomize";
import { useNavigate } from "react-router-dom";
import { navigateToSelectMode } from "../../utils/quizNavigation.jsx";
import { toast } from "react-toastify";
const StudentMyQuizzes = () => {
    const account = useSelector(state => state.user.account);
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [myQuizzes, setMyQuizzes] = useState([]);

    // Check if user is logged in
    useEffect(() => {
        if (!account || !account.id) {
            toast.error("Vui lòng đăng nhập để xem quiz của bạn.");
            navigate('/login', { state: { from: '/student/my-quizzes' } });
        }
    }, [account, navigate]);

    const filteredQuizzes = myQuizzes.filter((q) =>
        q.name.toLowerCase().includes(search.toLowerCase())
    );
    const backendBaseURL = axiosInstance.defaults.baseURL + "storage/subjects/";

    useEffect(() => {
        const fetchQuizzes = async () => {
            if (!account || !account.id) return;

            try {
                const userId = account.id;
                const response = await fetchMyQuizzes(userId);
                setMyQuizzes(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy quiz của tôi:", error);
            }
        };

        if (account && account.id) {
            fetchQuizzes();
        }
    }, [account]);

    if (!account || !account.id) {
        return (
            <Container className="text-center py-5">
                <p className="text-light">Đang kiểm tra đăng nhập...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="student-myquizzes py-4">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <h4 className="fw-bold text-light m-0 text-gradient">Quiz của tôi</h4>

                <Form.Control
                    type="text"
                    placeholder="Tìm kiếm quiz..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-dark text-light border-secondary"
                    style={{ maxWidth: "250px" }}
                />
            </div>

            {/* Quiz List */}
            <Row className="g-4">
                {filteredQuizzes.map((quiz) => (
                    <Col xs={12} md={6} lg={4} key={quiz.id}>
                        <Card className="quiz-card h-100 bg-dark border-secondary text-light overflow-hidden">
                            <div
                                className="quiz-image"
                                style={{
                                    backgroundImage: `url(${backendBaseURL + quiz.imageUrl})`,
                                }}
                            ></div>

                            <Card.Body>
                                <Card.Title className="fw-semibold d-flex align-items-center">
                                    <FaBook className="me-2 text-secondary" />
                                    {quiz.name}
                                </Card.Title>

                                <Card.Text className="small text-white-50 mb-3 text-ellipsis">
                                    {quiz.description}
                                </Card.Text>
                                <Card.Subtitle className="mb-3">
                                    <span className="text-secondary small ">Mua vào: {quiz.purchasedAt} </span>

                                </Card.Subtitle>
                                <div className="d-flex gap-2">
                                    <Button
                                        variant="outline-light"
                                        size="sm"
                                        className="flex-fill"
                                        onClick={() => navigate(`/student/quizzes/${quiz.id}`)}
                                    >
                                        Chi tiết
                                    </Button>
                                    <Button
                                        variant="gradient"
                                        size="sm"
                                        className="flex-fill"
                                        onClick={() => navigateToSelectMode(navigate, quiz)}
                                    >
                                        Vào học
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {filteredQuizzes.length === 0 && (
                <p className="text-center text-secondary mt-4">
                    Bạn chưa có quiz nào được mua.
                </p>
            )}
        </Container>
    );
};

export default StudentMyQuizzes;
