import { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    InputGroup,
    Alert,
    Spinner,
    Badge,
} from "react-bootstrap";
import {
    FaImage,
    FaSave,
    FaArrowLeft,
    FaDollarSign,
    FaTrash,
    FaCheckCircle,
    FaBan,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import "./SellerSubjectDetailPage.scss";
import { getQuizQuestions, getQuizDetail } from "../../services/apiService";
import instance from "../../utils/axiosCustomize";
import { updateSubject, deleteQuestion, createQuestionsBatch, updateQuestion } from "../../services/apiService";
import { toast } from "react-toastify"

const SellerSubjectDetailPage = () => {
    const navigate = useNavigate();
    const { quizId } = useParams();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [imageFile, setImageFile] = useState(null);
    const [subject, setSubject] = useState();
    const [questions, setQuestions] = useState([]);
    const [originalQuestions, setOriginalQuestions] = useState([]);
    const [questionToDelete, setQuestionToDelete] = useState([]);
    const backendBaseURL = instance.defaults.baseURL + "storage/subjects/";

    useEffect(() => {
        const fetchSubjectDetail = async () => {
            setLoading(true);
            try {
                const subjectResponse = await getQuizDetail(quizId);
                const questionsResponse = await getQuizQuestions(quizId);
                setSubject(subjectResponse.data);
                setQuestions(questionsResponse.data);
                setOriginalQuestions(JSON.parse(JSON.stringify(questionsResponse.data)));
            } catch (error) {
                console.error('Error fetching subject detail:', error);
                setMessage({ type: 'danger', text: 'Lỗi khi tải chi tiết môn học.' });
            } finally {
                setLoading(false);
            }
        };

        if (quizId) {
            fetchSubjectDetail();
        }
    }, [quizId]);

    const handleChange = (e) =>
        setSubject({ ...subject, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        setSubject({ ...subject, [e.target.name]: e.target.files[0] });
        setImageFile(e.target.files[0]);
    };

    const handleToggleStatus = () => {
        const newStatus = subject.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        setSubject({ ...subject, status: newStatus });
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                content: "",
                explanation: "",
                options: [
                    { content: "", isCorrect: false },
                    { content: "", isCorrect: false },
                    { content: "", isCorrect: false },
                    { content: "", isCorrect: false },
                ],
            },
        ]);
    };

    const removeQuestion = async (qIndex) => {
        setQuestionToDelete([...questionToDelete, questions[qIndex]]);

        // Remove from local state
        const updated = [...questions];
        updated.splice(qIndex, 1);
        setQuestions(updated);
    };

    const handleQuestionChange = (qIndex, field, value) => {
        const updated = [...questions];
        updated[qIndex][field] = value;
        setQuestions(updated);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex].content = value;
        setQuestions(updated);
    };

    const toggleCorrect = (qIndex, oIndex) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex].isCorrect =
            !updated[qIndex].options[oIndex].isCorrect;
        setQuestions(updated);
    };

    const addOption = (qIndex) => {
        const updated = [...questions];
        updated[qIndex].options.push({ content: "", isCorrect: false });
        setQuestions(updated);
    };

    const removeOption = (qIndex, oIndex) => {
        const updated = [...questions];
        updated[qIndex].options.splice(oIndex, 1);
        setQuestions(updated);
    };

    const isQuestionModified = (question, originalQuestion) => {
        if (!originalQuestion) return true;

        if (question.content !== originalQuestion.content) return true;
        if ((question.explanation || '') !== (originalQuestion.explanation || '')) return true;
        if (question.options.length !== originalQuestion.options.length) return true;

        for (let i = 0; i < question.options.length; i++) {
            const opt = question.options[i];
            const origOpt = originalQuestion.options[i];
            if (opt.content !== origOpt.content || opt.isCorrect !== origOpt.isCorrect) {
                return true;
            }
        }

        return false;
    };

    const validateSubject = () => {
        if (!subject.name.trim()) {
            toast.error('Tên môn học không được để trống');
            return false;
        }
        if (!subject.description.trim()) {
            toast.error('Mô tả không được để trống');
            return false;
        }
        if (subject.price < 0) {
            toast.error('Giá phải lớn hơn hoặc bằng 0');
            return false;
        }

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.content.trim()) {
                toast.error(`Nội dung câu hỏi ${i + 1} không được để trống`);
                return false;
            }
            if (q.options.length < 2) {
                toast.error(`Câu hỏi ${i + 1} phải có ít nhất 2 đáp án`);
                return false;
            }
            const hasCorrect = q.options.some(o => o.isCorrect);
            if (!hasCorrect) {
                toast.error(`Câu hỏi ${i + 1} phải có ít nhất một đáp án đúng`);
                return false;
            }
            for (let j = 0; j < q.options.length; j++) {
                if (!q.options[j].content.trim()) {
                    toast.error(`Câu hỏi ${i + 1}, Đáp án ${j + 1} không được để trống`);
                    return false;
                }
            }
        }
        return true;
    };

    const handleSaveSubject = async () => {
        if (!validateSubject()) {
            return;
        }

        setLoading(true);
        try {
            // Save subject info
            const formData = new FormData();
            const subjectData = {
                id: subject.id,
                name: subject.name,
                status: subject.status,
                description: subject.description,
                price: parseFloat(subject.price),
            };
            formData.append('subject', JSON.stringify(subjectData));

            if (imageFile) {
                formData.append('image', imageFile);
            }
            const subjectResponse = await updateSubject(formData);
            if (subjectResponse.statusCode !== 200) {
                toast.error("Lỗi khi cập nhật môn học.");
                return;
            }

            if (questionToDelete.length > 0) {
                // Delete questions that were removed
                for (const q of questionToDelete) {
                    const response = await deleteQuestion(q.id);
                    if (response.statusCode !== 200) {
                        console.error(`Error deleting question ${q.id}:`, response);
                        toast.error("Lỗi khi xóa câu hỏi.");
                        return;
                    }
                }
                setQuestionToDelete([]);
            }

            const newQuestions = questions.filter(q => !q.id);
            const existingQuestions = questions.filter(q => q.id);

            if (newQuestions.length > 0) {
                const createDTOs = newQuestions.map(q => ({
                    subjectId: subject.id,
                    content: q.content,
                    explanation: q.explanation || '',
                    options: q.options.map((opt, idx) => ({
                        content: opt.content,
                        isCorrect: opt.isCorrect,
                        optionOrder: idx + 1
                    }))
                }));
                const createResponse = await createQuestionsBatch(createDTOs);
                if (createResponse.statusCode !== 201) {
                    console.error('Error creating questions:', createResponse);
                    toast.error("Lỗi khi thêm câu hỏi mới.");
                    return;
                }
            }

            // Update only modified existing questions
            const modifiedQuestions = existingQuestions.filter(q => {
                const original = originalQuestions.find(oq => oq.id === q.id);
                return isQuestionModified(q, original);
            });

            for (const q of modifiedQuestions) {
                const updateDTO = {
                    id: q.id,
                    subjectId: subject.id,
                    content: q.content,
                    explanation: q.explanation || '',
                    options: q.options.map((opt, idx) => ({
                        content: opt.content,
                        isCorrect: opt.isCorrect,
                        optionOrder: idx + 1
                    }))
                };
                const response = await updateQuestion(updateDTO);
                if (response.statusCode !== 200) {
                    console.error(`Error updating question ${q.id}:`, response);
                    toast.error("Lỗi khi cập nhật câu hỏi.");
                    return;
                }

            }

            toast.success("Cập nhật môn học và câu hỏi thành công!");

            // Refresh data after save
            const questionsResponse = await getQuizQuestions(quizId);
            setQuestions(questionsResponse.data);
            setOriginalQuestions(JSON.parse(JSON.stringify(questionsResponse.data)));
            setImageFile(null);
        } catch (error) {
            console.error('Error saving subject:', error);
            setMessage({
                type: 'danger',
                text: error.response?.data?.message || 'Lỗi khi cập nhật môn học và câu hỏi.'
            });
            toast.error("Lỗi khi cập nhật môn học và câu hỏi.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        return status === "ACTIVE" ? (
            <Badge bg="success" className="px-3 py-2">
                <FaCheckCircle className="me-2" />
                Active
            </Badge>
        ) : status === "INACTIVE" ? (
            <Badge bg="secondary" className="px-3 py-2">
                <FaBan className="me-2" />
                Inactive
            </Badge>
        ) : (
            <></>
        );
    };

    return <>
        {subject && (
            <div className="seller-subject-detail-page">
                <Container fluid="lg">
                    <div className="position-sticky top-0 bg-dark pt-4 p-3 mb-4" style={{ zIndex: 10 }}>
                        {message.text && (
                            <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                                {message.text}
                            </Alert>
                        )}

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <Button
                                    variant="outline-light"
                                    className="mb-3"
                                    onClick={() => navigate(-1)}
                                >
                                    <FaArrowLeft className="me-2" />
                                    Quay lại
                                </Button>
                                <h3 className="fw-bold text-gradient">{subject.name}</h3>
                                <p className="text-secondary mb-0">
                                    Chỉnh sửa thông tin và câu hỏi môn học
                                </p>
                            </div>
                            <div className="d-flex gap-2 align-items-center">
                                {getStatusBadge(subject.status)}

                                {(subject.status === "ACTIVE" || subject.status === "INACTIVE") && (
                                    <Button
                                        variant={subject.status === "ACTIVE" ? "outline-danger" : "outline-success"}
                                        onClick={handleToggleStatus}
                                    >
                                        {subject.status === "ACTIVE" ? (
                                            <>
                                                <FaBan className="me-2" />
                                                Tắt
                                            </>
                                        ) : (
                                            <>
                                                <FaCheckCircle className="me-2" />
                                                Bật
                                            </>
                                        )}
                                    </Button>)}
                                <Button
                                    className="btn-gradient"
                                    onClick={handleSaveSubject}
                                    disabled={loading}
                                >
                                    {loading ? <Spinner size="sm" className="me-2" /> : <FaSave className="me-2" />}
                                    Lưu Thay Đổi
                                </Button>
                            </div>
                        </div>
                    </div>


                    <Row className="g-4">
                        {/* Subject Details */}
                        <Col lg={12}>
                            <Card className="bg-dark border-0 p-4 shadow-sm">
                                <h5 className="fw-semibold text-white mb-3">Thông Tin Môn Học</h5>

                                <Form.Control
                                    type="hidden"
                                    name="id"
                                    value={subject.id}
                                    onChange={handleChange}
                                    className="bg-dark text-light border-secondary"
                                />
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light">Tên Môn Học</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        placeholder="Nhập tên môn học"
                                        value={subject.name}
                                        onChange={handleChange}
                                        className="bg-dark text-light border-secondary"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light">Mô tả</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        placeholder="Mô tả nội dung của môn học này..."
                                        value={subject.description}
                                        onChange={handleChange}
                                        className="bg-dark text-light border-secondary"
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="text-light">Giá (₫)</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text className="bg-dark border-secondary text-light">
                                                    <FaDollarSign />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="number"
                                                    name="price"
                                                    value={subject.price}
                                                    onChange={handleChange}
                                                    className="bg-dark text-light border-secondary"
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="text-light">Hình Ảnh</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text className="bg-dark border-secondary text-light">
                                                    <FaImage />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="file"
                                                    name="imageUrl"
                                                    onChange={handleFileChange}
                                                    className="bg-dark text-light border-secondary"
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {subject.imageUrl && (
                                    <div className="mt-3 text-center">
                                        <img
                                            width={250}
                                            src={imageFile ? URL.createObjectURL(imageFile) : backendBaseURL + subject.imageUrl}
                                            alt="Preview"
                                            className="img-fluid rounded"

                                        />
                                    </div>
                                )}
                            </Card>
                        </Col>

                        {/* Questions */}
                        <Col lg={12}>
                            <Card className="bg-dark border-0 p-4 shadow-sm">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="fw-semibold text-white mb-0">
                                        Câu Hỏi ({questions.length})
                                    </h5>
                                </div>

                                {questions.map((q, qIndex) => (
                                    <Card key={qIndex} className="bg-secondary bg-opacity-10 border-0 p-3 mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="text-light mb-0">Câu Hỏi {qIndex + 1}</h6>
                                            <Button variant="outline-light" onClick={() => removeQuestion(qIndex)}>
                                                <FaTrash />
                                            </Button>
                                        </div>

                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập nội dung câu hỏi"
                                            value={q.content}
                                            onChange={(e) =>
                                                handleQuestionChange(qIndex, 'content', e.target.value)
                                            }
                                            className="bg-dark text-light border-secondary mb-3"
                                        />

                                        {q.options.map((option, oIndex) => (
                                            <div
                                                key={oIndex}
                                                className={`answer-option p-2 rounded mb-2 d-flex gap-2 ${option.isCorrect ? "correct" : ""
                                                    }`}
                                                onDoubleClick={() => toggleCorrect(qIndex, oIndex)}
                                            >
                                                <Form.Control
                                                    type="text"
                                                    placeholder={`Đáp án ${oIndex + 1}`}
                                                    value={option.content}
                                                    onChange={(e) =>
                                                        handleOptionChange(qIndex, oIndex, e.target.value)
                                                    }
                                                    className="bg-dark text-light border-secondary"
                                                />
                                                {q.options.length > 2 && (
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => removeOption(qIndex, oIndex)}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}

                                        <Form.Group className="mt-3 mb-3">
                                            <Form.Label className="text-light">Giải thích (Tùy chọn)</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                placeholder="Giải thích đáp án đúng..."
                                                value={q.explanation || ''}
                                                onChange={(e) =>
                                                    handleQuestionChange(qIndex, 'explanation', e.target.value)
                                                }
                                                className="bg-dark text-light border-secondary"
                                            />
                                        </Form.Group>

                                        <Button
                                            variant="outline-light"
                                            className="w-50 py-2 mx-auto hover-gradient"
                                            onClick={() => addOption(qIndex)}
                                        >
                                            + Thêm Đáp Án
                                        </Button>
                                    </Card>
                                ))}

                                <Button
                                    variant="outline-light"
                                    className="w-100 py-2 mt-2 hover-gradient"
                                    onClick={addQuestion}
                                >
                                    + Thêm Câu Hỏi
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        )}
    </>
}

export default SellerSubjectDetailPage;
