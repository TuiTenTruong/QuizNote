import { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Badge,
    Dropdown,
    Form,
} from "react-bootstrap";
import {
    FaBookOpen,
    FaClock,
    FaUser,
    FaFilter,
} from "react-icons/fa";
import "./SellerQuizzes.scss";
import { FaEllipsisV } from "react-icons/fa";

const quizList = [
    {
        title: "Introduction to Biology",
        desc: "Basic concepts of biology for beginners",
        questions: 15,
        duration: "20 min",
        completions: 32,
        status: "Published",
        category: "Biology",
        createdAt: "Just now",
    },
    {
        title: "Advanced Mathematics",
        desc: "Algebra and calculus problems for university level",
        questions: 20,
        duration: "30 min",
        completions: 58,
        status: "Published",
        category: "Math",
        createdAt: "2 days ago",
    },
    {
        title: "Chemistry Fundamentals",
        desc: "Learn basic chemical reactions and formulas",
        questions: 18,
        duration: "25 min",
        completions: 12,
        status: "Draft",
        category: "Chemistry",
        createdAt: "5 days ago",
    },
];

function SellerQuizzes() {
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");

    const filteredQuizzes = quizList.filter(
        (quiz) =>
            (filter === "All" || quiz.status === filter) &&
            quiz.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="seller-quizzes">
            <h3 className="fw-bold mb-3 text-white text-center text-md-start">
                My Quiz Library
            </h3>
            <p className="text-secondary mb-4 text-center text-md-start">
                Browse and manage all your quizzes in one place.
            </p>

            {/* FILTER BAR */}
            <div className="filter-bar d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-4">
                <div className="btn-group w-100 w-md-auto" role="group">
                    {["All", "Published", "Draft"].map((tab) => (
                        <Button
                            key={tab}
                            variant={filter === tab ? "gradient-active" : "outline-light"}
                            className="flex-fill"
                            onClick={() => setFilter(tab)}
                        >
                            {tab}
                        </Button>
                    ))}
                </div>

                <div className="search-filter d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
                    <Form.Control
                        type="text"
                        placeholder="Search quizzes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-dark text-light border-secondary flex-fill"
                        aria-label="Search quizzes"
                    />
                    <Dropdown>
                        <Dropdown.Toggle
                            variant="outline-light"
                            id="dropdown-category-filter"
                            className="w-100 w-sm-auto"
                        >
                            <FaFilter className="me-2" /> All Categories
                        </Dropdown.Toggle>
                        <Dropdown.Menu variant="dark">
                            <Dropdown.Item active>All Categories</Dropdown.Item>
                            <Dropdown.Item>Math</Dropdown.Item>
                            <Dropdown.Item>Chemistry</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>

            {/* QUIZ LIST */}
            <Row className="g-3">
                {filteredQuizzes.map((quiz, i) => (
                    <Col xs={12} key={i}>
                        <Card className="quiz-item bg-dark border-light p-3 p-sm-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                                {/* LEFT */}
                                <div className="d-flex gap-3 align-items-start w-100">
                                    <div className="icon-box d-none d-sm-flex">
                                        <FaBookOpen size="1.3em" />
                                    </div>
                                    <div className="quiz-info flex-grow-1">
                                        <h6 className="fw-semibold mb-1 text-white">
                                            {quiz.title}
                                        </h6>
                                        <p className="text-secondary small mb-2">{quiz.desc}</p>
                                        <div className="quiz-meta d-flex flex-wrap gap-3 small text-white-50">
                                            <span>
                                                <FaUser className="me-1" /> {quiz.completions} users
                                            </span>
                                            <span>
                                                <FaClock className="me-1" /> {quiz.duration}
                                            </span>
                                            <span>{quiz.questions} questions</span>
                                            <span>{quiz.createdAt}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT */}
                                <div className="quiz-actions d-flex justify-content-end align-items-center gap-1">
                                    <Badge className="m-0 p-2"
                                        bg={
                                            quiz.status === "Published" ? "success" : "warning"
                                        }
                                        text={
                                            quiz.status === "Published" ? "light" : "dark"
                                        }
                                    >
                                        {quiz.status}
                                    </Badge>
                                    <Button
                                        size="sm"
                                        variant="outline-light"
                                        className="flex-fill flex-sm-grow-0"
                                    >
                                        View
                                    </Button>
                                    <Dropdown align="end" className="z-2">
                                        <Dropdown.Toggle
                                            variant="dark"
                                            className="border-0"
                                            id={`dropdown-${i}`}
                                        >
                                            <FaEllipsisV />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item>Edit</Dropdown.Item>
                                            <Dropdown.Item>Duplicate</Dropdown.Item>
                                            <Dropdown.Item className="text-danger">
                                                Delete
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}

                {filteredQuizzes.length === 0 && (
                    <p className="text-center text-secondary mt-4">
                        No quizzes found for this filter.
                    </p>
                )}
            </Row>
        </div>
    );
}

export default SellerQuizzes;
