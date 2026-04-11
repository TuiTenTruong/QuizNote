import { useMemo, useState } from "react";
import { Row, Col, Card, Form, Button, InputGroup, Alert, Spinner, Badge, Container } from "react-bootstrap";
import { FaImage, FaSave, FaArrowLeft, FaDollarSign, FaTrash, FaCheckCircle, FaBan } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import instance from "../../utils/axiosCustomize";
import {
    useSellerSubjectDetailQuery,
    useSellerSubjectUpdateMutation,
} from "../../hooks/useSubject";
import {
    useSellerCreateQuestionsBatchMutation,
    useSellerDeleteQuestionMutation,
    useSellerQuestionsQuery,
    useSellerUpdateQuestionMutation,
} from "../../hooks/useQuestion";
import styles from "./scss/SellerSubjectDetailSection.module.scss";

const SellerSubjectDetailSection = () => {
    const navigate = useNavigate();
    const { quizId } = useParams();
    const subjectId = useMemo(() => Number(quizId), [quizId]);

    const {
        subject,
        loading: subjectLoading,
        error: subjectError,
        setSubject,
        refetch: refetchSubject,
    } = useSellerSubjectDetailQuery(subjectId);
    const {
        questions,
        loading: questionsLoading,
        setQuestions,
        refetch: refetchQuestions,
    } = useSellerQuestionsQuery(subjectId);
    const { updateSellerSubject } = useSellerSubjectUpdateMutation();
    const { deleteSellerQuestion } = useSellerDeleteQuestionMutation();
    const { createSellerQuestionsBatch } = useSellerCreateQuestionsBatchMutation();
    const { updateSellerQuestion } = useSellerUpdateQuestionMutation();

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [questionImageFiles, setQuestionImageFiles] = useState<{ [key: number]: File }>({});
    const [questionToDelete, setQuestionToDelete] = useState<any[]>([]);
    const backendBaseURL = `${instance.defaults.baseURL}storage/subjects/`;
    const questionImageBaseURL = `${instance.defaults.baseURL}storage/questions/`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setSubject((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) {
            return;
        }
        setImageFile(e.target.files[0]);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                content: "",
                type: "ONE_CHOICE",
                explanation: "",
                imageUrl: null,
                options: [
                    { content: "", isCorrect: false },
                    { content: "", isCorrect: false },
                ],
            },
        ]);
    };

    const handleQuestionTypeChange = (qIndex: number, newType: string) => {
        const updated = [...questions];
        updated[qIndex].type = newType;
        setQuestions(updated);
    };

    const handleQuestionChange = (qIndex: number, field: string, value: string) => {
        const updated = [...questions];
        updated[qIndex][field] = value;
        setQuestions(updated);
    };

    const handleQuestionImageChange = (qIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setQuestionImageFiles((prev) => ({
                ...prev,
                [qIndex]: file,
            }));
        }
    };

    const toggleCorrect = (qIndex: number, oIndex: number) => {
        const updated = [...questions];
        if (updated[qIndex].type === "ONE_CHOICE") {
            // Set all answers to false
            updated[qIndex].options = updated[qIndex].options.map((opt: any, index: number) => ({
                ...opt,
                isCorrect: index === oIndex,
            }));
        } else {
            updated[qIndex].options[oIndex].isCorrect =
                !updated[qIndex].options[oIndex].isCorrect;
        }
        setQuestions(updated);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex].content = value;
        setQuestions(updated);
    };

    const addOption = (qIndex: number) => {
        const updated = [...questions];
        updated[qIndex].options.push({ content: "", isCorrect: false });
        setQuestions(updated);
    };
    const removeQuestion = (qIndex: number) => {
        setQuestionToDelete([...questionToDelete, questions[qIndex]]);
        const updated = [...questions];
        updated.splice(qIndex, 1);
        setQuestions(updated);
    };

    const removeOption = (qIndex: number, oIndex: number) => {
        const updated = [...questions];
        updated[qIndex].options.splice(oIndex, 1);
        setQuestions(updated);
    };

    const handleSaveSubject = async () => {
        if (!subject?.name?.trim()) {
            toast.error("Ten mon hoc khong duoc de trong");
            return;
        }

        setSaving(true);
        try {
            const formData = new FormData();
            formData.append(
                "subject",
                JSON.stringify({
                    id: subject.id,
                    name: subject.name,
                    status: subject.status,
                    description: subject.description,
                    price: parseFloat(String(subject.price)),
                })
            );

            if (imageFile) {
                formData.append("image", imageFile);
            }

            const subjectResponse = await updateSellerSubject(formData);
            if (subjectResponse.statusCode !== 200) {
                toast.error("Loi khi cap nhat mon hoc");
                return;
            }

            for (const q of questionToDelete) {
                if (q?.id) {
                    await deleteSellerQuestion(q.id);
                }
            }

            const newQuestions = questions.filter((q) => !q.id);
            if (newQuestions.length > 0) {
                const createDTOs = newQuestions.map((q) => ({
                    subjectId: subject.id,
                    content: q.content,
                    type: q.type || "ONE_CHOICE",
                    explanation: q.explanation || "",
                    options: q.options.map((opt: any, idx: number) => ({
                        content: opt.content,
                        isCorrect: opt.isCorrect,
                        optionOrder: idx + 1,
                    })),
                }));
                await createSellerQuestionsBatch(createDTOs as any);
            }

            const existingQuestions = questions.filter((q) => q.id);
            for (const q of existingQuestions) {
                await updateSellerQuestion({
                    id: q.id,
                    subjectId: subject.id,
                    content: q.content,
                    type: q.type || "ONE_CHOICE",
                    explanation: q.explanation || "",
                    options: q.options.map((opt: any, idx: number) => ({
                        ...opt,
                        optionOrder: idx + 1,
                    })),
                } as any);
            }

            toast.success("Cap nhat mon hoc thanh cong");
            await Promise.all([refetchSubject(), refetchQuestions()]);
            setQuestionToDelete([]);
        } catch (error) {
            console.error("Error saving subject:", error);
            toast.error("Loi khi cap nhat mon hoc");
        } finally {
            setSaving(false);
        }
    };

    const getStatusBadge = (status: string) => {
        if (status === "ACTIVE") {
            return <Badge bg="success" className="px-3 py-2"><FaCheckCircle className="me-2" /> Active</Badge>;
        }
        if (status === "INACTIVE") {
            return <Badge bg="secondary" className="px-3 py-2"><FaBan className="me-2" /> Inactive</Badge>;
        }
        return <Badge bg="warning" className="px-3 py-2 text-dark">Draft</Badge>;
    };

    if (subjectLoading || questionsLoading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="light" />
            </div>
        );
    }

    if (!subject) {
        return null;
    }

    return (
        <div className={styles.sellerSubjectDetailPage}>
            <Container fluid="lg">
                <div className="position-sticky top-0 bg-dark pt-4 p-3 mb-4" style={{ zIndex: 10 }}>
                    {subjectError && (
                        <Alert variant="danger">{subjectError}</Alert>
                    )}
                    {message.text && (
                        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: "", text: "" })}>
                            {message.text}
                        </Alert>
                    )}

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <Button variant="outline-light" className="mb-3" onClick={() => navigate(-1)}>
                                <FaArrowLeft className="me-2" /> Quay lai
                            </Button>
                            <h3 className="fw-bold text-gradient">{subject.name}</h3>
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                            {getStatusBadge(subject.status)}
                            <Button className="btn-gradient" onClick={handleSaveSubject} disabled={saving}>
                                {saving ? <Spinner size="sm" className="me-2" /> : <FaSave className="me-2" />} Luu
                            </Button>
                        </div>
                    </div>
                </div>

                <Row className="g-4">
                    <Col lg={12}>
                        <Card className="bg-dark border-0 p-4 shadow-sm">
                            <h5 className="fw-semibold text-white mb-3">Thong Tin Mon Hoc</h5>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-light">Ten Mon Hoc</Form.Label>
                                <Form.Control type="text" name="name" value={subject.name} onChange={handleChange} className="bg-dark text-light border-secondary" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-light">Mo ta</Form.Label>
                                <Form.Control as="textarea" rows={3} name="description" value={subject.description} onChange={handleChange} className="bg-dark text-light border-secondary" />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-light">Gia</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text className="bg-dark border-secondary text-light"><FaDollarSign /></InputGroup.Text>
                                            <Form.Control type="number" name="price" value={subject.price} onChange={handleChange} className="bg-dark text-light border-secondary" />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-light">Hinh anh</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text className="bg-dark border-secondary text-light"><FaImage /></InputGroup.Text>
                                            <Form.Control type="file" onChange={handleFileChange} className="bg-dark text-light border-secondary" />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Row>
                            {subject.imageUrl && (
                                <div className="mt-3 text-center">
                                    <img width={250} src={imageFile ? URL.createObjectURL(imageFile) : backendBaseURL + subject.imageUrl} alt="Preview" className="img-fluid rounded" />
                                </div>
                            )}
                        </Card>
                    </Col>

                    {/* <Col lg={12}>
                        <Card className="bg-dark border-0 p-4 shadow-sm">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-semibold text-white mb-0">Cau hoi ({questions.length})</h5>
                            </div>
                            {questions.map((q, qIndex) => (
                                <Card key={qIndex} className="bg-secondary bg-opacity-10 border-0 p-3 mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="text-light mb-0">Cau hoi {qIndex + 1}</h6>
                                        <Button variant="outline-light" onClick={() => removeQuestion(qIndex)}><FaTrash /></Button>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhap noi dung cau hoi"
                                        value={q.content}
                                        onChange={(e) => {
                                            const updated = [...questions];
                                            updated[qIndex].content = e.target.value;
                                            setQuestions(updated);
                                        }}
                                        className="bg-dark text-light border-secondary mb-3"
                                    />
                                </Card>
                            ))}
                            <Button variant="outline-light" className="w-100 py-2 mt-2 hover-gradient" onClick={addQuestion}>
                                + Them cau hoi
                            </Button>
                        </Card>
                    </Col> */}
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
                                        <div className="d-flex gap-2">
                                            <Form.Group>
                                                <Form.Select
                                                    value={q.type || "ONE_CHOICE"}
                                                    onChange={(e) => handleQuestionTypeChange(qIndex, e.target.value)}
                                                    className="bg-dark text-light border-secondary"
                                                >
                                                    <option value="ONE_CHOICE">One Choice</option>
                                                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Button variant="outline-light" onClick={() => removeQuestion(qIndex)}>
                                                <FaTrash />
                                            </Button>
                                        </div>
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

                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-light">Hình Ảnh Câu Hỏi</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text className="bg-dark border-secondary text-light">
                                                <FaImage />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuestionImageChange(qIndex, e)}
                                                className="bg-dark text-light border-secondary"
                                            />
                                        </InputGroup>
                                        {(questionImageFiles[qIndex] || q.imageUrl) && (
                                            <div className="mt-2">
                                                <img
                                                    src={questionImageFiles[qIndex]
                                                        ? URL.createObjectURL(questionImageFiles[qIndex])
                                                        : questionImageBaseURL + q.imageUrl}
                                                    alt="Question Preview"
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: '150px' }}
                                                />
                                            </div>
                                        )}
                                    </Form.Group>

                                    {q.options.map((option: any, oIndex: number) => (
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
    );
};

export default SellerSubjectDetailSection;
