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
} from "react-bootstrap";
import {
    FaClock,
    FaListAlt,
    FaEye,
    FaSave,
    FaArrowRight,
    FaArrowLeft,
    FaDollarSign,
    FaTrash,
} from "react-icons/fa";
import "./CreateQuiz.scss";

function CreateQuiz() {
    const [step, setStep] = useState(1);
    const [quiz, setQuiz] = useState({
        title: "",
        description: "",
        category: "",
        difficulty: "Medium",
        timeLimit: 15,
        passingScore: 70,
        randomizeQuestions: true,
        randomizeAnswers: true,
        immediateResults: false,
        visibility: "Public",
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

    const handleToggle = (key) =>
        setQuiz({ ...quiz, [key]: !quiz[key] });

    const addQuestion = () => {
        setQuiz({
            ...quiz,
            questions: [
                ...quiz.questions,
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

    return (
        <div className="create-quiz-page">
            <Container fluid="sm">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="fw-bold text-gradient">Create New Quiz</h3>
                        <p className="text-secondary mb-0">
                            Add questions, set answers and configure quiz settings.
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant="outline-light  hover-gradient">
                            <FaSave className="me-2" /> Save Draft
                        </Button>
                        <Button className="btn-gradient">
                            <FaEye className="me-2" /> Preview
                        </Button>
                    </div>
                </div>

                {step === 1 && (
                    <Row className="g-4">
                        {/* QUIZ DETAILS */}
                        <Col md={7}>
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

                                <Row>
                                    <Col md={6}>
                                        <Form.Label className="text-light">Category</Form.Label>
                                        <Form.Select
                                            name="category"
                                            className="bg-dark text-light border-secondary"
                                            onChange={handleChange}
                                        >
                                            <option>Science</option>
                                            <option>Math</option>
                                            <option>Language</option>
                                            <option>History</option>
                                        </Form.Select>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label className="text-light">Difficulty</Form.Label>
                                        <Form.Select
                                            name="difficulty"
                                            value={quiz.difficulty}
                                            onChange={handleChange}
                                            className="bg-dark text-light border-secondary"
                                        >
                                            <option>Easy</option>
                                            <option>Medium</option>
                                            <option>Hard</option>
                                        </Form.Select>
                                    </Col>

                                </Row>

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
                            </Card>
                        </Col>

                        {/* QUIZ SETTINGS */}
                        <Col md={5}>
                            <Card className="bg-dark border-0 p-4 shadow-sm">
                                <h5 className="fw-semibold text-white mb-3">Quiz Settings</h5>

                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light">
                                        Time Limit (minutes)
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="timeLimit"
                                        value={quiz.timeLimit}
                                        onChange={handleChange}
                                        className="bg-dark text-light border-secondary"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light">
                                        Passing Score (%)
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="passingScore"
                                        value={quiz.passingScore}
                                        onChange={handleChange}
                                        className="bg-dark text-light border-secondary"
                                    />
                                </Form.Group>

                                <Form.Check
                                    type="switch"
                                    label="Randomize Questions"
                                    checked={quiz.randomizeQuestions}
                                    onChange={() => handleToggle("randomizeQuestions")}
                                    className="text-light mb-2"
                                />
                                <Form.Check
                                    type="switch"
                                    label="Randomize Answers"
                                    checked={quiz.randomizeAnswers}
                                    onChange={() => handleToggle("randomizeAnswers")}
                                    className="text-light mb-2"
                                />
                                <Form.Check
                                    type="switch"
                                    label="Immediate Results"
                                    checked={quiz.immediateResults}
                                    onChange={() => handleToggle("immediateResults")}
                                    className="text-light mb-2"
                                />
                                <Form.Check
                                    type="switch"
                                    label="Private Quiz"
                                    checked={quiz.visibility === "Private"}
                                    onChange={() =>
                                        setQuiz({
                                            ...quiz,
                                            visibility:
                                                quiz.visibility === "Public" ? "Private" : "Public",
                                        })
                                    }
                                    className="text-light"
                                />
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
                                        <Form.Control
                                            type="number"
                                            value={q.points}
                                            onChange={(e) => {
                                                const updated = [...quiz.questions];
                                                updated[qIndex].points = e.target.value;
                                                setQuiz({ ...quiz, questions: updated });
                                            }}
                                            className="bg-dark text-light border-secondary small"
                                            style={{ width: "80px" }}
                                        />
                                        <Form.Select
                                            value={q.type}
                                            className="bg-dark text-light border-secondary small"
                                            onChange={(e) => {
                                                const updated = [...quiz.questions];
                                                updated[qIndex].type = e.target.value;
                                                setQuiz({ ...quiz, questions: updated });
                                            }}
                                        >
                                            <option>Multiple Answers</option>
                                            <option>Single Choice</option>
                                            <option>True / False</option>
                                        </Form.Select>
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
                        >
                            <FaArrowLeft className="me-2" /> Prev
                        </Button>
                    ) : (
                        <div />
                    )}

                    {step < 2 ? (
                        <Button className="btn-gradient" onClick={() => setStep(step + 1)}>
                            Next <FaArrowRight className="ms-2" />
                        </Button>
                    ) : (
                        <Button className="btn-gradient">
                            Preview & Publish
                        </Button>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default CreateQuiz;
