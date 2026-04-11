import { useState, type ChangeEvent } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    InputGroup,
    Dropdown,
    Alert,
    Spinner,
} from "react-bootstrap";
import {
    FaImage,
    FaSave,
    FaArrowRight,
    FaArrowLeft,
    FaDollarSign,
    FaTrash,
} from "react-icons/fa";
import styles from "./scss/SellerCreateQuizSection.module.scss";
import { createSubject, saveDraftSubject } from "../../api/subject.api";
import { createQuestion, createQuestionsBatch } from "../../api/question.api";
import { useNavigate } from "react-router-dom";
import type { IReqCreateSubject } from "../../types";

type QuestionType = "ONE_CHOICE" | "MULTIPLE_CHOICE";

interface DraftAnswer {
    text: string;
    isCorrect: boolean;
}

interface DraftQuestion {
    text: string;
    type: QuestionType;
    imageFile: File | null;
    explanation?: string;
    answers: DraftAnswer[];
}

interface QuizFormState {
    title: string;
    description: string;
    price: number;
    imageUrl: File | null;
    questions: DraftQuestion[];
}

interface MessageState {
    type: "" | "danger" | "success";
    text: string;
}

interface ApiErrorShape {
    response?: {
        data?: {
            message?: string;
        };
    };
}

const buildDefaultQuestion = (): DraftQuestion => ({
    text: "",
    type: "ONE_CHOICE",
    imageFile: null,
    answers: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
    ],
});

function SellerCreateQuizSection() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<MessageState>({ type: "", text: "" });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<QuizFormState>({
        title: "",
        description: "",
        price: 0,
        imageUrl: null,
        questions: [],
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === "price") {
            const parsedPrice = Number(value);
            setQuiz((prev) => ({ ...prev, price: Number.isNaN(parsedPrice) ? 0 : parsedPrice }));
            return;
        }

        setQuiz((prev) => ({ ...prev, [name]: value }));
    };



    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setQuiz((prev) => ({ ...prev, imageUrl: file }));
        setImageFile(file);
    };

    const addQuestion = () => {
        setQuiz((prev) => ({
            ...prev,
            questions: [...prev.questions, buildDefaultQuestion()],
        }));
    };

    const addAnswer = (qIndex: number) => {
        const updated = [...quiz.questions];
        updated[qIndex].answers.push({ text: "", isCorrect: false });
        setQuiz({ ...quiz, questions: updated });
    };

    const removeQuestion = (qIndex: number) => {
        const updated = [...quiz.questions];
        updated.splice(qIndex, 1);
        setQuiz({ ...quiz, questions: updated });
    };

    const removeAnswer = (qIndex: number, aIndex: number) => {
        const updated = [...quiz.questions];
        updated[qIndex].answers.splice(aIndex, 1);
        setQuiz({ ...quiz, questions: updated });
    };

    const handleAnswerChange = (qIndex: number, aIndex: number, value: string) => {
        const updated = [...quiz.questions];
        updated[qIndex].answers[aIndex].text = value;
        setQuiz({ ...quiz, questions: updated });
    };

    const toggleCorrect = (qIndex: number, aIndex: number) => {
        const updated = [...quiz.questions];
        if (updated[qIndex].type === "ONE_CHOICE") {
            // Set all answers to false
            updated[qIndex].answers = updated[qIndex].answers.map((ans, index) => ({
                ...ans,
                isCorrect: index === aIndex,
            }));
        } else {
            updated[qIndex].answers[aIndex].isCorrect = !updated[qIndex].answers[aIndex].isCorrect;
        }
        setQuiz({ ...quiz, questions: updated });
    };

    const handleQuestionFileChange = (qIndex: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const file = (e.target as HTMLInputElement).files?.[0] ?? null;
        const updated = [...quiz.questions];
        updated[qIndex].imageFile = file;
        setQuiz({ ...quiz, questions: updated });
    };

    const handleQuestionTypeChange = (qIndex: number, newType: QuestionType) => {
        const updated = [...quiz.questions];
        updated[qIndex].type = newType;
        setQuiz({ ...quiz, questions: updated });
    };

    const validateQuiz = () => {
        if (!quiz.title.trim()) {
            setMessage({ type: 'danger', text: 'Tên môn học không được để trống' });
            return false;
        }
        if (!quiz.description.trim()) {
            setMessage({ type: 'danger', text: 'Mô tả bài kiểm tra không được để trống' });
            return false;
        }
        if (quiz.price < 0) {
            setMessage({ type: 'danger', text: 'Giá phải lớn hơn hoặc bằng 0' });
            return false;
        }




        for (let i = 0; i < quiz.questions.length; i++) {
            const q = quiz.questions[i];
            if (!q.text.trim()) {
                setMessage({ type: 'danger', text: `Nội dung câu hỏi ${i + 1} không được để trống` });
                return false;
            }
            if (q.answers.length < 2) {
                setMessage({ type: 'danger', text: `Câu hỏi ${i + 1} phải có ít nhất 2 đáp án` });
                return false;
            }
            const hasCorrect = q.answers.some(a => a.isCorrect);
            if (!hasCorrect) {
                setMessage({ type: 'danger', text: `Câu hỏi ${i + 1} phải có ít nhất một đáp án đúng` });
                return false;
            }
            for (let j = 0; j < q.answers.length; j++) {
                if (!q.answers[j].text.trim()) {
                    setMessage({ type: 'danger', text: `Câu hỏi ${i + 1}, Đáp án ${j + 1} không được để trống` });
                    return false;
                }
            }
            const hasManyCorrect = q.answers.filter(a => a.isCorrect).length > 1;
            if (q.type === "ONE_CHOICE" && hasManyCorrect) {
                setMessage({ type: 'danger', text: `Câu hỏi ${i + 1} chỉ được có một đáp án đúng` });
                return false;
            }
        }
        return true;
    };

    const handlePublishQuiz = async () => {
        if (!validateQuiz()) {
            return;
        }

        setLoading(true);

        try {
            // Create subject/quiz
            const formData = new FormData();
            const subjectData = {
                name: quiz.title,
                description: quiz.description,
                price: quiz.price,
            };
            formData.append('subject', JSON.stringify(subjectData));

            if (imageFile) {
                formData.append('image', imageFile);
            }
            submitQuiz(formData);
        } catch (error) {
            console.error('Error creating quiz:', error);
            const apiMessage = (error as ApiErrorShape)?.response?.data?.message;
            setMessage({
                type: 'danger',
                text: apiMessage || 'Error creating quiz. Please try again.'
            });
            setLoading(false);
        }
    };

    const submitQuiz = async (formData: FormData) => {
        try {
            const quizRes = await createSubject(formData);
            const quizId = quizRes.data.id;

            // Prepare batch questions with images
            const batchFormData = new FormData();

            // Prepare questions data
            const questionsData = quiz.questions.map((question) => ({
                subjectId: quizId,
                content: question.text,
                explanation: question.explanation || '',
                type: question.type,
                options: question.answers.map((answer, index) => ({
                    content: answer.text,
                    isCorrect: answer.isCorrect,
                    optionOrder: index + 1
                }))
            }));

            // Add questions as JSON
            batchFormData.append('questions', new Blob([JSON.stringify(questionsData)], {
                type: 'application/json'
            }));

            // Add images if they exist
            quiz.questions.forEach((question, index) => {
                if (question.imageFile) {
                    batchFormData.append('images', question.imageFile);
                } else {
                    // Add empty blob for questions without images to maintain index alignment
                    batchFormData.append('images', new Blob());
                }
            });

            // Create all questions in batch
            await createQuestionsBatch(batchFormData);

            setMessage({ type: 'success', text: 'Tạo bài kiểm tra thành công!' });
            setTimeout(() => {
                navigate('/seller');
            }, 2000);
        } catch (error) {
            console.error('Lỗi khi tạo bài kiểm tra:', error);
            const apiMessage = (error as ApiErrorShape)?.response?.data?.message;
            setMessage({
                type: 'danger',
                text: apiMessage || 'Tạo bài kiểm tra thất bại. Vui lòng thử lại.'
            });
        } finally {
            setLoading(false);
        }
    };
    const handleSaveDraft = async () => {
        if (!validateQuiz()) {
            return;
        }
        setLoading(true);
        try {
            // Create draft subject with DRAFT status
            const draftData: IReqCreateSubject = {
                name: quiz.title,
                description: quiz.description,
                price: quiz.price,
                status: "DRAFT",
            };

            const response = await saveDraftSubject(draftData);
            const subjectId = response.data.id;

            // Create questions for draft
            if (quiz.questions && quiz.questions.length > 0) {
                for (const question of quiz.questions) {
                    if (question.text.trim()) { // Only save questions with content
                        const questionData = {
                            subjectId: subjectId,
                            content: question.text,
                            explanation: question.explanation || '',
                            type: question.type,
                            options: question.answers
                                .filter(answer => answer.text.trim()) // Only save answers with content
                                .map((answer, index) => ({
                                    content: answer.text,
                                    isCorrect: answer.isCorrect,
                                    optionOrder: index + 1
                                }))
                        };
                        // Only create question if it has at least one answer
                        if (questionData.options.length > 0) {
                            await createQuestion(questionData);
                        }
                    }
                }
            }

            setMessage({ type: 'success', text: 'Lưu nháp thành công!' });
            setTimeout(() => {
                navigate('/seller');
            }, 2000);
        } catch (error) {
            console.error('Lỗi khi lưu nháp:', error);
            const apiMessage = (error as ApiErrorShape)?.response?.data?.message;
            setMessage({
                type: 'danger',
                text: apiMessage || 'Lỗi khi lưu nháp. Vui lòng thử lại.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.createQuizPage}>
            <Container fluid="sm">
                {message.text && (
                    <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                        {message.text}
                    </Alert>
                )}

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="fw-bold text-gradient">Tạo Môn Học Mới</h3>
                        <p className="text-secondary mb-0">
                            Thêm câu hỏi, đặt đáp án và cấu hình cài đặt bài kiểm tra.
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            className="btn-gradient"
                            onClick={handleSaveDraft}
                            disabled={loading}
                        >
                            {loading ? <Spinner size="sm" className="me-2" /> : <FaSave className="me-2" />}
                            Lưu Nháp
                        </Button>
                    </div>
                </div>

                {step === 1 && (
                    <Row className="g-4">
                        {/* QUIZ DETAILS */}
                        <Col>
                            <Card className="bg-dark border-0 p-4 shadow-sm">
                                <h5 className="fw-semibold text-white mb-3">Chi Tiết</h5>

                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light">Tên Môn Học</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        placeholder="Nhập tên môn học"
                                        value={quiz.title}
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
                                        value={quiz.description}
                                        onChange={handleChange}
                                        className="bg-dark text-light border-secondary"
                                    />
                                </Form.Group>

                                <Form.Group className="mt-3">
                                    <Form.Label className="text-light">Giá (₫)</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text className="bg-dark border-secondary text-light">
                                            <FaDollarSign />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            name="price"
                                            value={quiz.price}
                                            onChange={handleChange}
                                            className="bg-dark text-light border-secondary"
                                        />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className="mt-3">
                                    <Form.Label className="text-light">Hình Ảnh Nền</Form.Label>
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
                                {/* image preview */}
                                {quiz.imageUrl && (
                                    <div className="mt-3 mx-auto">
                                        <img
                                            width={250}
                                            src={URL.createObjectURL(quiz.imageUrl)}
                                            alt="Background Preview"
                                            className="img-fluid rounded"
                                        />
                                    </div>
                                )}
                            </Card>
                        </Col>
                    </Row>
                )}

                {step === 2 && (
                    <Card className="bg-dark border-0 p-4 shadow-sm">
                        <h5 className="fw-semibold text-white mb-3">Câu Hỏi Môn Học</h5>

                        {quiz.questions.map((q, qIndex) => (
                            <Card key={qIndex} className="bg-secondary bg-opacity-10 border-0 p-3 mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="text-light mb-0">Câu Hỏi {qIndex + 1}</h6>
                                    <div className=" d-flex gap-2">
                                        <Form.Group>
                                            <Form.Select
                                                value={q.type}
                                                onChange={(e) => handleQuestionTypeChange(qIndex, e.target.value as QuestionType)}
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
                                    placeholder="Nhập câu hỏi của bạn ở đây"
                                    value={q.text}
                                    onChange={(e) => {
                                        const updated = [...quiz.questions];
                                        updated[qIndex].text = e.target.value;
                                        setQuiz({ ...quiz, questions: updated });
                                    }}
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
                                            onChange={(e) => handleQuestionFileChange(qIndex, e)}
                                            className="bg-dark text-light border-secondary"
                                        />
                                    </InputGroup>
                                    {q.imageFile && (
                                        <div className="mt-2">
                                            <img
                                                src={URL.createObjectURL(q.imageFile)}
                                                alt="Preview"
                                                className="img-fluid rounded"
                                                style={{ maxHeight: '150px' }}
                                            />
                                        </div>
                                    )}
                                </Form.Group>

                                {q.answers.map((a, aIndex) => (
                                    <div
                                        key={aIndex}
                                        className={`answer-option p-2 rounded mb-2 ${a.isCorrect ? "correct" : ""
                                            }`}
                                        onDoubleClick={() => toggleCorrect(qIndex, aIndex)}
                                    >
                                        <Form.Control
                                            type="text"
                                            placeholder={`Đáp án ${aIndex + 1}`}
                                            value={a.text}
                                            onChange={(e) =>
                                                handleAnswerChange(qIndex, aIndex, e.target.value)
                                            }
                                            className="bg-dark text-light border-secondary"
                                        />
                                    </div>
                                ))}
                                {/* // Add explanation textearea */}
                                <Form.Group className="mt-3">
                                    <Form.Label className="text-light">Giải thích (Tùy chọn)</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name={`explanation-${qIndex}`}
                                        placeholder="Giải thích đáp án đúng..."
                                        value={q.explanation || ''}
                                        onChange={(e) => {
                                            const updated = [...quiz.questions];
                                            updated[qIndex].explanation = e.target.value;
                                            setQuiz({ ...quiz, questions: updated });
                                        }}
                                        className="bg-dark text-light border-secondary"
                                    />
                                </Form.Group>

                                <Button
                                    variant="outline-light"
                                    className="w-50 py-2 mt-2 mx-auto hover-gradient"
                                    onClick={() => addAnswer(qIndex)}
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
                )}

                {/* Navigation */}
                <div className="d-flex justify-content-between mt-4">
                    {step > 1 ? (
                        <Button
                            variant="outline-light hover-gradient"
                            onClick={() => setStep(step - 1)}
                            disabled={loading}
                        >
                            <FaArrowLeft className="me-2" /> Trở Lại
                        </Button>
                    ) : (
                        <div />
                    )}

                    {step < 2 ? (
                        <Button
                            className="btn-gradient"
                            onClick={() => setStep(step + 1)}
                            disabled={loading}
                        >
                            Kế Tiếp
                            <FaArrowRight className="ms-2" />
                        </Button>
                    ) : (
                        <Button
                            className="btn-gradient"
                            onClick={handlePublishQuiz}
                            disabled={loading}
                        >
                            {loading ? <Spinner size="sm" className="me-2" /> : null}
                            Xét Duyệt
                        </Button>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default SellerCreateQuizSection;
