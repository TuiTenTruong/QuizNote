import { useState } from "react";
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
import "./CreateQuiz.scss";
import { createQuiz, createQuestion, saveDraftQuiz } from "../../services/apiService";

function CreateQuiz() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [imageFile, setImageFile] = useState(null);
    const [quiz, setQuiz] = useState({
        title: "",
        description: "",
        price: 0,
        questions: [
            {
                text: "",
                type: "Multiple Answers",
                points: 10,
                answers: [
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                ],
            },
        ],
    });

    const handleChange = (e) =>
        setQuiz({ ...quiz, [e.target.name]: e.target.value });



    const handleFileChange = (e) => {
        setQuiz({ ...quiz, [e.target.name]: e.target.files[0] });
        setImageFile(e.target.files[0]);
    }



    const handleToggle = (key) =>
        setQuiz({ ...quiz, [key]: !quiz[key] });

    const addQuestion = () => {
        setQuiz({
            ...quiz,
            questions: [
                ...quiz.questions,
                {
                    text: "",
                    answers: [
                        { text: "", isCorrect: false },
                        { text: "", isCorrect: false },
                        { text: "", isCorrect: false },
                        { text: "", isCorrect: false },
                    ],
                },
            ],
        });
    };

    const addAnswer = (qIndex) => {
        const updated = [...quiz.questions];
        updated[qIndex].answers.push({ text: "", isCorrect: false });
        setQuiz({ ...quiz, questions: updated });
    };

    const removeQuestion = (qIndex) => {
        const updated = [...quiz.questions];
        updated.splice(qIndex, 1);
        setQuiz({ ...quiz, questions: updated });
    };
    const removeAnswer = (qIndex, aIndex) => {
        const updated = [...quiz.questions];
        updated[qIndex].answers.splice(aIndex, 1);
        setQuiz({ ...quiz, questions: updated });
    };
    const handleAnswerChange = (qIndex, aIndex, value) => {
        const updated = [...quiz.questions];
        updated[qIndex].answers[aIndex].text = value;
        setQuiz({ ...quiz, questions: updated });
    };

    const toggleCorrect = (qIndex, aIndex) => {
        const updated = [...quiz.questions];
        updated[qIndex].answers[aIndex].isCorrect =
            !updated[qIndex].answers[aIndex].isCorrect;
        setQuiz({ ...quiz, questions: updated });
    };

    const validateQuiz = () => {
        if (!quiz.title.trim()) {
            setMessage({ type: 'danger', text: 'Quiz title is required' });
            return false;
        }
        if (!quiz.description.trim()) {
            setMessage({ type: 'danger', text: 'Quiz description is required' });
            return false;
        }
        if (quiz.price < 0) {
            setMessage({ type: 'danger', text: 'Price must be greater than 0' });
            return false;
        }
        if (quiz.questions.length === 0) {
            setMessage({ type: 'danger', text: 'At least one question is required' });
            return false;
        }

        for (let i = 0; i < quiz.questions.length; i++) {
            const q = quiz.questions[i];
            if (!q.text.trim()) {
                setMessage({ type: 'danger', text: `Question ${i + 1} text is required` });
                return false;
            }
            if (q.answers.length < 2) {
                setMessage({ type: 'danger', text: `Question ${i + 1} must have at least 2 answers` });
                return false;
            }
            const hasCorrect = q.answers.some(a => a.isCorrect);
            if (!hasCorrect) {
                setMessage({ type: 'danger', text: `Question ${i + 1} must have at least one correct answer` });
                return false;
            }
            for (let j = 0; j < q.answers.length; j++) {
                if (!q.answers[j].text.trim()) {
                    setMessage({ type: 'danger', text: `Question ${i + 1}, Answer ${j + 1} text is required` });
                    return false;
                }
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
                price: parseFloat(quiz.price),
            };
            formData.append('subject', JSON.stringify(subjectData));

            if (imageFile) {
                formData.append('image', imageFile);
            }
            submitQuiz(formData);
        } catch (error) {
            console.error('Error creating quiz:', error);
            setMessage({
                type: 'danger',
                text: error.response?.data?.message || 'Error creating quiz. Please try again.'
            });
            setLoading(false);
        }
    };

    const submitQuiz = async (formData) => {
        try {
            const quizRes = await createQuiz(formData);
            const quizId = quizRes.data.id;

            // Create questions
            for (const question of quiz.questions) {
                const questionData = {
                    subjectId: quizId,
                    content: question.text,
                    options: question.answers.map((answer, index) => ({
                        content: answer.text,
                        isCorrect: answer.isCorrect,
                        optionOrder: index + 1
                    }))
                };
                await createQuestion(questionData);
            }

            setMessage({ type: 'success', text: 'Quiz created successfully!' });
            setTimeout(() => {
                // Reset form or redirect
                window.location.href = '/seller-dashboard';
            }, 2000);
        } catch (error) {
            console.error('Error creating quiz:', error);
            setMessage({
                type: 'danger',
                text: error.response?.data?.message || 'Error creating quiz. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };
    const handleSaveDraft = async () => {
        setLoading(true);
        try {
            await saveDraftQuiz({
                ...quiz,
                status: 'DRAFT'
            });
            setMessage({ type: 'success', text: 'Quiz draft saved successfully!' });
        } catch (error) {
            console.error('Error saving draft:', error);
            setMessage({
                type: 'danger',
                text: error.response?.data?.message || 'Error saving draft. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-quiz-page">
            <Container fluid="sm">
                {message.text && (
                    <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                        {message.text}
                    </Alert>
                )}

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="fw-bold text-gradient">Create New Quiz</h3>
                        <p className="text-secondary mb-0">
                            Add questions, set answers and configure quiz settings.
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            className="btn-gradient"
                            onClick={handleSaveDraft}
                            disabled={loading}
                        >
                            {loading ? <Spinner size="sm" className="me-2" /> : <FaSave className="me-2" />}
                            Save Draft
                        </Button>
                    </div>
                </div>

                {step === 1 && (
                    <Row className="g-4">
                        {/* QUIZ DETAILS */}
                        <Col>
                            <Card className="bg-dark border-0 p-4 shadow-sm">
                                <h5 className="fw-semibold text-white mb-3">Quiz Details</h5>

                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light">Quiz Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        placeholder="Enter quiz title"
                                        value={quiz.title}
                                        onChange={handleChange}
                                        className="bg-dark text-light border-secondary"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light">Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        placeholder="Describe what this quiz covers..."
                                        value={quiz.description}
                                        onChange={handleChange}
                                        className="bg-dark text-light border-secondary"
                                    />
                                </Form.Group>

                                <Form.Group className="mt-3">
                                    <Form.Label className="text-light">Price (₫)</Form.Label>
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
                                    <Form.Label className="text-light">Background Image</Form.Label>
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
                        <h5 className="fw-semibold text-white mb-3">Quiz Questions</h5>

                        {quiz.questions.map((q, qIndex) => (
                            <Card key={qIndex} className="bg-secondary bg-opacity-10 border-0 p-3 mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="text-light mb-0">Question {qIndex + 1}</h6>
                                    <div className=" d-flex gap-2">

                                        <Button variant="outline-light" onClick={() => removeQuestion(qIndex)}>
                                            <FaTrash />
                                        </Button>

                                    </div>
                                </div>

                                <Form.Control
                                    type="text"
                                    placeholder="Enter your question here"
                                    value={q.text}
                                    onChange={(e) => {
                                        const updated = [...quiz.questions];
                                        updated[qIndex].text = e.target.value;
                                        setQuiz({ ...quiz, questions: updated });
                                    }}
                                    className="bg-dark text-light border-secondary mb-3"
                                />

                                {q.answers.map((a, aIndex) => (
                                    <div
                                        key={aIndex}
                                        className={`answer-option p-2 rounded mb-2 ${a.isCorrect ? "correct" : ""
                                            }`}
                                        onClick={() => toggleCorrect(qIndex, aIndex)}
                                    >
                                        <Form.Control
                                            type="text"
                                            placeholder={`Answer option ${aIndex + 1}`}
                                            value={a.text}
                                            onChange={(e) =>
                                                handleAnswerChange(qIndex, aIndex, e.target.value)
                                            }
                                            className="bg-dark text-light border-secondary"
                                        />
                                    </div>
                                ))}
                                <Button
                                    variant="outline-light"
                                    className="w-50 py-2 mt-2 mx-auto hover-gradient"
                                    onClick={addAnswer.bind(this, qIndex)}
                                >
                                    + Add Option
                                </Button>
                            </Card>
                        ))}

                        <Button
                            variant="outline-light"
                            className="w-100 py-2 mt-2 hover-gradient"
                            onClick={addQuestion}
                        >
                            + Add Question
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
                            <FaArrowLeft className="me-2" /> Prev
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
                            Next <FaArrowRight className="ms-2" />
                        </Button>
                    ) : (
                        <Button
                            className="btn-gradient"
                            onClick={handlePublishQuiz}
                            disabled={loading}
                        >
                            {loading ? <Spinner size="sm" className="me-2" /> : null}
                            Preview & Publish
                        </Button>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default CreateQuiz;
