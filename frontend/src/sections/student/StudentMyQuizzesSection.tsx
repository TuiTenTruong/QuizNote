import { useState } from "react";
import type { ChangeEvent, ReactElement } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
} from "react-bootstrap";
import { FaBook } from "react-icons/fa";
import styles from "./scss/StudentMyQuizzes.module.scss";
import axiosInstance from "../../utils/axiosCustomize";
import { useNavigate } from "react-router-dom";
import { navigateToSelectMode } from "../../utils/quizNavigation";
import { useMyQuizzes } from "../../hooks/useQuiz";
import useRequireAuth from "../../hooks/useRequireAuth";

const StudentMyQuizzesSection = (): ReactElement => {
    const navigate = useNavigate();
    const { account, isAuthenticated } = useRequireAuth({
        fromPath: "/student/my-quizzes",
        message: "Vui lòng đăng nhập để xem quiz của bạn.",
    });

    const userId = Number(account?.id);
    const safeUserId = Number.isFinite(userId) && userId > 0 ? userId : undefined;
    const { myQuizzes, isLoading } = useMyQuizzes(safeUserId);

    const [search, setSearch] = useState<string>("");

    const filteredQuizzes = myQuizzes.filter((q) =>
        q.name.toLowerCase().includes(search.toLowerCase())
    );
    const backendBaseURL = `${axiosInstance.defaults.baseURL ?? ""}storage/subjects/`;

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setSearch(e.target.value);
    };

    if (!isAuthenticated) {
        return (
            <Container className="text-center py-5">
                <p className="text-light">Đang kiểm tra đăng nhập...</p>
            </Container>
        );
    }
    if (isLoading) {
        return (
            <Container className="text-center py-5">
                <p className="text-light">Đang tải danh sách quiz...</p>
            </Container>
        );
    }
    return (
        <Container fluid className={`${styles.studentMyQuizzes} py-4`}>
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <h4 className={`fw-bold text-light m-0 ${styles.textGradient}`}>Quiz của tôi</h4>

                <Form.Control
                    type="text"
                    placeholder="Tìm kiếm quiz..."
                    value={search}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                    style={{ maxWidth: "250px" }}
                />
            </div>

            {/* Quiz List */}
            <Row className="g-4">
                {filteredQuizzes.map((quiz) => (
                    <Col xs={12} md={6} lg={4} key={quiz.id}>
                        <Card className={`${styles.quizCard} h-100 bg-dark border-secondary text-light overflow-hidden`}>
                            <div
                                className={styles.quizImage}
                                style={{
                                    backgroundImage: `url(${backendBaseURL + (quiz.imageUrl ?? "")})`,
                                }}
                            ></div>

                            <Card.Body>
                                <Card.Title className="fw-semibold d-flex align-items-center">
                                    <FaBook className="me-2 text-secondary" />
                                    {quiz.name}
                                </Card.Title>

                                <Card.Text className={`small text-white-50 mb-3 ${styles.textEllipsis}`}>
                                    {quiz.description ?? "Chua co mo ta"}
                                </Card.Text>
                                <Card.Subtitle className="mb-3">
                                    <span className="text-secondary small ">Mua vào: {quiz.purchasedAt ?? "N/A"} </span>

                                </Card.Subtitle>
                                <div className="d-flex gap-2">
                                    <Button
                                        variant="outline-light"
                                        size="sm"
                                        className="flex-fill"
                                        onClick={() => navigate(`/student/quizzes/${quiz.id}`, { state: { hasPurchased: true } })}
                                    >
                                        Chi tiết
                                    </Button>
                                    <Button
                                        variant="gradient"
                                        size="sm"
                                        className={`${styles.btnGradient} flex-fill`}
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

export default StudentMyQuizzesSection;
