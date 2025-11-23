import { useState, useEffect, use } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Table,
    Form,
    Modal,
    Badge,
    Spinner,
    Alert,
    InputGroup,
} from "react-bootstrap";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaCalendarAlt,
    FaImage,
} from "react-icons/fa";
import "./AdminWeeklyQuizPage.scss";
import {
    createWeeklyQuiz,
    getAllWeeklyQuizzes,
    updateWeeklyQuiz,
    deletedWeeklyQuiz,
    getWeeklyQuizQuestions,
} from "../../services/apiService";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosCustomize";

function AdminWeeklyQuizPage() {
    const [weeklyQuizzes, setWeeklyQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [quizData, setQuizData] = useState([]);
    const backendBaseURL = axiosInstance.defaults.baseURL + "storage/questions/";
    // Hàm tính tuần tiếp theo
    const getNextWeekInfo = () => {
        const now = new Date();
        const currentYear = now.getFullYear();

        // Tính số tuần hiện tại trong năm
        const startOfYear = new Date(currentYear, 0, 1);
        const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
        const currentWeek = Math.ceil((days + startOfYear.getDay() + 1) / 7);

        // Tuần tiếp theo
        const nextWeek = currentWeek + 1;

        // Nếu vượt quá 52 tuần, chuyển sang năm sau
        if (nextWeek > 52) {
            return { year: currentYear + 1, weekNumber: 1 };
        }

        return { year: currentYear, weekNumber: nextWeek };
    };

    // Hàm tạo thời gian bắt đầu tuần (Thứ 2 00:00)
    const getWeekStartDate = (year, weekNumber) => {
        const jan1 = new Date(year, 0, 1);
        const daysToAdd = (weekNumber - 1) * 7;
        const targetDate = new Date(jan1.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

        // Tìm thứ 2 của tuần đó
        const dayOfWeek = targetDate.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(targetDate.getTime() + diff * 24 * 60 * 60 * 1000);

        monday.setHours(0, 0, 0, 0);
        return monday.toISOString().slice(0, 16);
    };

    // Hàm tạo thời gian kết thúc tuần (Chủ nhật 23:59)
    const getWeekEndDate = (year, weekNumber) => {
        const jan1 = new Date(year, 0, 1);
        const daysToAdd = weekNumber * 7 - 1;
        const targetDate = new Date(jan1.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

        // Tìm chủ nhật của tuần đó
        const dayOfWeek = targetDate.getDay();
        const diff = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
        const sunday = new Date(targetDate.getTime() + diff * 24 * 60 * 60 * 1000);

        sunday.setHours(23, 59, 0, 0);
        return sunday.toISOString().slice(0, 16);
    };

    const nextWeekInfo = getNextWeekInfo();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        year: nextWeekInfo.year,
        weekNumber: nextWeekInfo.weekNumber,
        difficulty: "Trung bình",
        startDate: getWeekStartDate(nextWeekInfo.year, nextWeekInfo.weekNumber),
        endDate: getWeekEndDate(nextWeekInfo.year, nextWeekInfo.weekNumber),
        questions: Array(10)
            .fill(null)
            .map(() => ({
                content: "",
                imageFile: null,
                options: [
                    { content: "", isCorrect: false },
                    { content: "", isCorrect: false },
                    { content: "", isCorrect: false },
                    { content: "", isCorrect: false },
                ],
            })),
    });

    useEffect(() => {
        fetchWeeklyQuizzes();
    }, []);
    useEffect(() => {
        const fetchDetailsQuiz = async () => {
            try {
                setLoading(true);
                const response = await getWeeklyQuizQuestions(currentQuiz?.id);
                setQuizData(response.data);
            } catch (error) {
                toast.error("Lỗi khi tải chi tiết weekly quiz");
            } finally {
                setLoading(false);
            }
        };
        if (currentQuiz) {
            fetchDetailsQuiz();
        } else {
            setQuizData([]);
        }
    }, [currentQuiz]);
    const fetchWeeklyQuizzes = async () => {
        try {
            setLoading(true);
            const response = await getAllWeeklyQuizzes();
            setWeeklyQuizzes(response.data.result || []);

        } catch (error) {
            setMessage({
                type: "danger",
                text: "Lỗi khi tải danh sách weekly quiz",
            });
        } finally {
            setLoading(false);
        }
    };


    const handleOpenModal = (quiz = null) => {
        if (quiz) {
            setEditMode(true);
            setCurrentQuiz(quiz);
            setFormData({
                title: quizData.title,
                description: quizData.description,
                year: quizData.year,
                weekNumber: quizData.weekNumber,
                difficulty: quizData.difficulty,
                startDate: quizData.startDate
                    ? new Date(quizData.startDate).toISOString().slice(0, 16)
                    : getWeekStartDate(quizData.year, quizData.weekNumber),
                endDate: quizData.endDate
                    ? new Date(quizData.endDate).toISOString().slice(0, 16)
                    : getWeekEndDate(quizData.year, quizData.weekNumber),
                questions:
                    quizData.questions && quizData.questions.length === 10
                        ? quizData.questions.map((q) => ({
                            content: q.content,
                            imageFile: null,
                            imagePreview: q.imageUrl ? (backendBaseURL + q.imageUrl) : null,
                            options: q.options.map((opt) => ({
                                content: opt.content,
                                isCorrect: opt.isCorrect,
                            })),
                        }))
                        : Array(10)
                            .fill(null)
                            .map(() => ({
                                content: "",
                                imageFile: null,
                                options: [
                                    { content: "", isCorrect: false },
                                    { content: "", isCorrect: false },
                                    { content: "", isCorrect: false },
                                    { content: "", isCorrect: false },
                                ],
                            })),
            });
        } else {
            setEditMode(false);
            setCurrentQuiz(null);
            const newWeekInfo = getNextWeekInfo();
            setFormData({
                title: "",
                description: "",
                year: newWeekInfo.year,
                weekNumber: newWeekInfo.weekNumber,
                difficulty: "Trung bình",
                startDate: getWeekStartDate(newWeekInfo.year, newWeekInfo.weekNumber),
                endDate: getWeekEndDate(newWeekInfo.year, newWeekInfo.weekNumber),
                questions: Array(10)
                    .fill(null)
                    .map(() => ({
                        content: "",
                        imageFile: null,
                        options: [
                            { content: "", isCorrect: false },
                            { content: "", isCorrect: false },
                            { content: "", isCorrect: false },
                            { content: "", isCorrect: false },
                        ],
                    })),
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditMode(false);
        setCurrentQuiz(null);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[index][field] = value;
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleQuestionFileChange = (qIndex, e) => {
        const file = e.target.files[0];
        const newQuestions = [...formData.questions];
        newQuestions[qIndex].imageFile = file;
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleOptionChange = (qIndex, optIndex, field, value) => {
        const newQuestions = [...formData.questions];
        if (field === "isCorrect" && value) {
            newQuestions[qIndex].options.forEach((opt, i) => {
                opt.isCorrect = i === optIndex;
            });
        } else {
            newQuestions[qIndex].options[optIndex][field] = value;
        }
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // validate
        for (let i = 0; i < formData.questions.length; i++) {
            const q = formData.questions[i];
            if (!q.content.trim()) {
                setMessage({
                    type: "danger",
                    text: `Câu hỏi ${i + 1} không được để trống`,
                });
                return;
            }
            const validOptions = q.options.filter((opt) => opt.content.trim());
            if (validOptions.length < 2) {
                setMessage({
                    type: "danger",
                    text: `Câu hỏi ${i + 1} phải có ít nhất 2 đáp án`,
                });
                return;
            }
            const correctCount = q.options.filter((opt) => opt.isCorrect).length;
            if (correctCount !== 1) {
                setMessage({
                    type: "danger",
                    text: `Câu hỏi ${i + 1} phải có đúng 1 đáp án đúng`,
                });
                return;
            }
        }

        try {
            const formDataToSend = new FormData();

            // Prepare quiz data
            const quizData = {
                title: formData.title,
                description: formData.description,
                year: formData.year,
                weekNumber: formData.weekNumber,
                difficulty: formData.difficulty,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                questions: formData.questions.map((q) => ({
                    content: q.content,
                    imageUrl: q.imageUrl || null,
                    options: q.options
                        .filter((opt) => opt.content.trim())
                        .map((opt) => ({
                            id: opt.id,
                            content: opt.content,
                            isCorrect: opt.isCorrect,
                        })),
                })),
            };

            // Add quiz data as JSON
            formDataToSend.append('weeklyQuiz', new Blob([JSON.stringify(quizData)], {
                type: 'application/json'
            }));

            // Add images - always send 10 elements (empty Blob for questions without new images)
            formData.questions.forEach((question) => {
                if (question.imageFile) {
                    formDataToSend.append('images', question.imageFile);
                } else {
                    formDataToSend.append('images', new Blob());
                }
            });

            if (editMode && currentQuiz) {
                const response = await updateWeeklyQuiz(currentQuiz.id, formDataToSend);
                if (response.statusCode === 200) {
                    toast.success("Cập nhật weekly quiz thành công");
                } else {
                    toast.error(
                        response.data?.message ||
                        "Có lỗi xảy ra khi cập nhật weekly quiz, vui lòng thử lại."
                    );
                    return;
                }
            } else {
                const response = await createWeeklyQuiz(formDataToSend);
                if (response.statusCode === 201) {
                    toast.success("Tạo weekly quiz thành công");
                } else {
                    toast.error(
                        response.data?.message ||
                        "Có lỗi xảy ra khi tạo weekly quiz, vui lòng thử lại."
                    );
                    return;
                }
            }

            handleCloseModal();
            fetchWeeklyQuizzes();
        } catch (error) {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa weekly quiz này?")) {
            return;
        }
        try {
            const response = await deletedWeeklyQuiz(id);
            if (response.status !== 200) {
                toast.error(
                    response.data?.message ||
                    "Có lỗi xảy ra khi xóa weekly quiz, vui lòng thử lại."
                );
                return;
            }
            toast.success("Xóa weekly quiz thành công");
            fetchWeeklyQuizzes();
        } catch (error) {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    const formatRange = (start, end) => {
        if (!start || !end) return "--";
        const s = new Date(start).toLocaleDateString("vi-VN");
        const e = new Date(end).toLocaleDateString("vi-VN");
        return `${s} - ${e}`;
    };

    return (
        <div className="admin-weekly-quiz-page">
            <Container fluid >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold text-gradient mb-1">Quản lý Weekly Quiz</h2>
                        <p className="text-muted mb-0">
                            Tạo và quản lý các bài Weekly Quiz để học viên làm mỗi tuần một lần.
                        </p>
                    </div>
                    <Button className="btn-gradient" onClick={() => handleOpenModal()}>
                        <FaPlus className="me-2" />
                        Tạo Weekly Quiz
                    </Button>
                </div>

                {message.text && (
                    <Alert
                        variant={message.type}
                        onClose={() => setMessage({ type: "", text: "" })}
                        dismissible
                        className="mb-3"
                    >
                        {message.text}
                    </Alert>
                )}

                {loading ? (
                    <div className="text-center py-5 text-light">
                        <Spinner animation="border" variant="light" />
                    </div>
                ) : (
                    <Card className="weekly-table-card bg-dark text-light border-0 shadow-sm">
                        <Card.Body>
                            <Table
                                hover
                                responsive
                                variant="dark"
                                className="align-middle weekly-table"
                            >
                                <thead>
                                    <tr>
                                        <th>Tuần</th>
                                        <th>Tiêu đề</th>
                                        <th>Thời gian</th>
                                        <th>Độ khó</th>
                                        <th>Trạng thái</th>
                                        <th className="text-end">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {weeklyQuizzes.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center text-secondary py-4">
                                                Chưa có weekly quiz nào
                                            </td>
                                        </tr>
                                    ) : (
                                        weeklyQuizzes.map((quiz) => (
                                            <tr key={quiz.id}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="calendar-icon">
                                                            <FaCalendarAlt />
                                                        </span>
                                                        <div>
                                                            <div className="fw-semibold">
                                                                Week {quiz.weekNumber} · {quiz.year}
                                                            </div>
                                                            <small className="text-secondary">
                                                                ID: {quiz.id}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="fw-semibold">{quiz.title}</div>
                                                    {quiz.description && (
                                                        <small className="text-secondary d-block text-truncate w-75">
                                                            {quiz.description}
                                                        </small>
                                                    )}
                                                </td>
                                                <td>
                                                    <small className="text-secondary">
                                                        {formatRange(quiz.startDate, quiz.endDate)}
                                                    </small>
                                                </td>
                                                <td>
                                                    <Badge bg="info" pill>
                                                        {quiz.difficulty}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    {quiz.active ? (
                                                        <Badge bg="success" pill>
                                                            Đang hoạt động
                                                        </Badge>
                                                    ) : (
                                                        <Badge bg="secondary" pill>
                                                            Không hoạt động
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="text-end">
                                                    <Button
                                                        variant="outline-warning"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleOpenModal(quiz)}
                                                    >
                                                        <FaEdit />
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(quiz.id)}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                )}

                {/* Modal */}
                <Modal
                    show={showModal}
                    onHide={handleCloseModal}
                    size="lg"
                    centered
                    className="weekly-quiz-modal"
                >
                    <Modal.Header closeButton className="bg-dark text-light border-0">
                        <Modal.Title className="fw-semibold">
                            {editMode ? "Chỉnh sửa Weekly Quiz" : "Tạo Weekly Quiz mới"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-dark text-light">
                        <Form onSubmit={handleSubmit}>
                            <Row className="g-3">
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label>Tiêu đề</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) =>
                                                setFormData({ ...formData, title: e.target.value })
                                            }
                                            placeholder="Nhập tiêu đề"
                                            required
                                            className="bg-dark text-light"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label>Mô tả</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={formData.description}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    description: e.target.value,
                                                })
                                            }
                                            className="bg-dark text-light"
                                            placeholder="Nhập mô tả"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Năm</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={formData.year}
                                            onChange={(e) => {
                                                const newYear = parseInt(e.target.value);
                                                setFormData({
                                                    ...formData,
                                                    year: newYear,
                                                    startDate: getWeekStartDate(newYear, formData.weekNumber),
                                                    endDate: getWeekEndDate(newYear, formData.weekNumber),
                                                });
                                            }}
                                            min="2024"
                                            required
                                            className="bg-dark text-light"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Tuần</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={formData.weekNumber}
                                            onChange={(e) => {
                                                const newWeekNumber = parseInt(e.target.value);
                                                setFormData({
                                                    ...formData,
                                                    weekNumber: newWeekNumber,
                                                    startDate: getWeekStartDate(formData.year, newWeekNumber),
                                                    endDate: getWeekEndDate(formData.year, newWeekNumber),
                                                });
                                            }}
                                            min="1"
                                            max="53"
                                            required
                                            className="bg-dark text-light"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Độ khó</Form.Label>
                                        <Form.Select
                                            value={formData.difficulty}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    difficulty: e.target.value,
                                                })
                                            }
                                            className="bg-dark text-light"
                                        >
                                            <option>Dễ</option>
                                            <option>Trung bình</option>
                                            <option>Khó</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Ngày bắt đầu</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={formData.startDate}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    startDate: e.target.value,
                                                })
                                            }
                                            required
                                            className="bg-dark text-light"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Ngày kết thúc</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={formData.endDate}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    endDate: e.target.value,
                                                })
                                            }
                                            required
                                            className="bg-dark text-light"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Questions */}
                            <div className="questions-section mt-4">
                                <h5 className="mb-3 fw-semibold">Tạo 10 câu hỏi</h5>
                                <div className="questions-container">
                                    {formData.questions.map((question, qIndex) => (
                                        <Card
                                            key={qIndex}
                                            className="question-card mb-3 bg-dark text-light"
                                        >
                                            <Card.Header className="d-flex justify-content-between align-items-center bg-question-header">
                                                <strong>Câu {qIndex + 1}</strong>
                                            </Card.Header>
                                            <Card.Body>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Nội dung câu hỏi *</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={2}
                                                        value={question.content}
                                                        onChange={(e) =>
                                                            handleQuestionChange(
                                                                qIndex,
                                                                "content",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Nhập nội dung câu hỏi..."
                                                        required
                                                        className="bg-dark text-light"
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>Hình ảnh câu hỏi (không bắt buộc)</Form.Label>
                                                    <InputGroup>
                                                        <InputGroup.Text className="bg-dark border-secondary text-light">
                                                            <FaImage />
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleQuestionFileChange(qIndex, e)}
                                                            className="bg-dark text-light border-secondary"
                                                        />
                                                    </InputGroup>
                                                    {question.imageFile && (
                                                        <div className="mt-2">
                                                            <img
                                                                src={URL.createObjectURL(question.imageFile)}
                                                                alt="Preview"
                                                                className="img-fluid rounded"
                                                                style={{ maxHeight: '150px' }}
                                                            />
                                                        </div>
                                                    )}
                                                    {!question.imageFile && question.imagePreview && (
                                                        <div className="mt-2">
                                                            <img
                                                                src={question.imagePreview}
                                                                alt="Current"
                                                                className="img-fluid rounded"
                                                                style={{ maxHeight: '150px' }}
                                                            />
                                                        </div>
                                                    )}
                                                </Form.Group>                                                <Form.Label>Đáp án (chọn 1 đáp án đúng) *</Form.Label>
                                                {question.options.map((option, optIndex) => (
                                                    <div
                                                        key={optIndex}
                                                        className="option-input-group mb-2"
                                                    >
                                                        <Row className="g-2">
                                                            <Col xs={1} className="d-flex align-items-center">
                                                                <Form.Check
                                                                    type="radio"
                                                                    name={`question-${qIndex}-correct`}
                                                                    checked={option.isCorrect}
                                                                    onChange={(e) =>
                                                                        handleOptionChange(
                                                                            qIndex,
                                                                            optIndex,
                                                                            "isCorrect",
                                                                            e.target.checked
                                                                        )
                                                                    }
                                                                />
                                                            </Col>
                                                            <Col xs={11}>
                                                                <Form.Control
                                                                    type="text"
                                                                    value={option.content}
                                                                    onChange={(e) =>
                                                                        handleOptionChange(
                                                                            qIndex,
                                                                            optIndex,
                                                                            "content",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    placeholder={`Đáp án ${String.fromCharCode(
                                                                        65 + optIndex
                                                                    )}`}
                                                                    className="bg-dark text-light"
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                ))}
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2 mt-3">
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleCloseModal}
                                >
                                    Hủy
                                </Button>
                                <Button type="submit" className="btn-gradient">
                                    {editMode ? "Cập nhật" : "Tạo mới"}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
}

export default AdminWeeklyQuizPage;
