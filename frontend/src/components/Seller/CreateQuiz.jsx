import { useReducer, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
} from "react-bootstrap";
import {
    FaEye,
    FaSave,
    FaArrowRight,
    FaArrowLeft,
} from "react-icons/fa";
import QuizDetails from "../../features/quizzes/components/QuizDetails";
import QuizSettings from "../../features/quizzes/components/QuizSettings";
import QuizQuestions from "../../features/quizzes/components/QuizQuestions";
import "./CreateQuiz.scss";

const initialState = {
    title: "",
    description: "",
    category: "Science",
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
};

function reducer(state, action) {
    switch (action.type) {
        case 'UPDATE_FIELD':
            return { ...state, [action.payload.field]: action.payload.value };
        case 'TOGGLE':
            return { ...state, [action.payload.field]: !state[action.payload.field] };
        case 'TOGGLE_VISIBILITY':
            return { ...state, visibility: state.visibility === 'Public' ? 'Private' : 'Public' };
        case 'ADD_QUESTION':
            return {
                ...state,
                questions: [
                    ...state.questions,
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
            };
        case 'DELETE_QUESTION':
            const newQuestions = [...state.questions];
            newQuestions.splice(action.payload.qIndex, 1);
            return { ...state, questions: newQuestions };
        case 'UPDATE_QUESTION':
            const updatedQuestions = [...state.questions];
            updatedQuestions[action.payload.qIndex].text = action.payload.value;
            return { ...state, questions: updatedQuestions };
        case 'UPDATE_QUESTION_TYPE':
            const updatedQuestionType = [...state.questions];
            updatedQuestionType[action.payload.qIndex].type = action.payload.value;
            return { ...state, questions: updatedQuestionType };
        case 'UPDATE_QUESTION_POINTS':
            const updatedQuestionPoints = [...state.questions];
            updatedQuestionPoints[action.payload.qIndex].points = action.payload.value;
            return { ...state, questions: updatedQuestionPoints };
        case 'ADD_ANSWER':
            const questionsWithNewAnswer = [...state.questions];
            questionsWithNewAnswer[action.payload.qIndex].answers.push({ text: "", isCorrect: false });
            return { ...state, questions: questionsWithNewAnswer };
        case 'UPDATE_ANSWER':
            const questionsWithUpdatedAnswer = [...state.questions];
            questionsWithUpdatedAnswer[action.payload.qIndex].answers[action.payload.aIndex].text = action.payload.value;
            return { ...state, questions: questionsWithUpdatedAnswer };
        case 'TOGGLE_CORRECT_ANSWER':
            const questionsWithToggledAnswer = [...state.questions];
            const answer = questionsWithToggledAnswer[action.payload.qIndex].answers[action.payload.aIndex];
            answer.isCorrect = !answer.isCorrect;
            return { ...state, questions: questionsWithToggledAnswer };
        default:
            return state;
    }
}


function CreateQuiz() {
    const [step, setStep] = useState(1);
    const [quiz, dispatch] = useReducer(reducer, initialState);

    const handleChange = (e) =>
        dispatch({ type: 'UPDATE_FIELD', payload: { field: e.target.name, value: e.target.value } });

    const handleToggle = (field) => {
        if (field === 'visibility') {
            dispatch({ type: 'TOGGLE_VISIBILITY' });
        } else {
            dispatch({ type: 'TOGGLE', payload: { field } });
        }
    }

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
                        <Button variant="outline-light" className="hover-gradient">
                            <FaSave className="me-2" /> Save Draft
                        </Button>
                        <Button className="btn-gradient">
                            <FaEye className="me-2" /> Preview
                        </Button>
                    </div>
                </div>

                {step === 1 && (
                    <Row className="g-4">
                        <Col md={7}>
                            <Card className="bg-dark border-0 p-4 shadow-sm">
                                <QuizDetails quiz={quiz} handleChange={handleChange} />
                            </Card>
                        </Col>
                        <Col md={5}>
                            <Card className="bg-dark border-0 p-4 shadow-sm">
                                <QuizSettings quiz={quiz} handleChange={handleChange} handleToggle={handleToggle} />
                            </Card>
                        </Col>
                    </Row>
                )}

                {step === 2 && (
                    <QuizQuestions questions={quiz.questions} dispatch={dispatch} />
                )}

                {/* Navigation */}
                <div className="d-flex justify-content-between mt-4">
                    {step > 1 ? (
                        <Button
                            variant="outline-light"
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