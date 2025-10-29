import { useState } from "react";
import {
    Container,
    Row,
    Col,
    Form,
    InputGroup,
    Button,
    Dropdown,
    Card,
    Badge,
    Carousel,
    Nav,
} from "react-bootstrap";
import {
    FaSearch,
    FaFilter,
    FaStar,
    FaBookOpen,
    FaClock,
    FaUser,
    FaPlay,
} from "react-icons/fa";
import "./StudentQuizDashboard.scss";

const quizData = [
    {
        title: "Hàm số và Đồ thị - Toán 10",
        category: "Math",
        difficulty: "Hard",
        author: "Trần Thị B",
        time: "30 min",
        price: 0,
        rating: 4.9,
        questions: 40,
        enrolled: 570,
        thumbnail: "https://i.imgur.com/rFs9O0u.jpg",
    },
    {
        title: "Phân loại động vật - Sinh học 7",
        category: "Biology",
        difficulty: "Medium",
        author: "Nguyễn Văn A",
        time: "20 min",
        price: 49000,
        rating: 4.7,
        questions: 50,
        enrolled: 320,
        thumbnail: "https://i.imgur.com/sbTQ0jR.jpg",
    },
    {
        title: "Ngữ pháp tiếng Anh cơ bản",
        category: "Language",
        difficulty: "Easy",
        author: "Phạm Mỹ Duyên",
        time: "25 min",
        price: 0,
        rating: 4.8,
        questions: 35,
        enrolled: 1050,
        thumbnail: "https://i.imgur.com/LDpRgTk.jpg",
    },
    {
        title: "Lịch sử Việt Nam hiện đại",
        category: "History",
        difficulty: "Easy",
        author: "Lê Quốc Cường",
        time: "15 min",
        price: 25000,
        rating: 4.6,
        questions: 30,
        enrolled: 220,
        thumbnail: "https://i.imgur.com/8VTEhW2.jpg",
    },
];

const categories = ["All", "Math", "Biology", "Language", "History", "Chemistry"];

const StudentQuizDashboard = () => {
    const [activeTab, setActiveTab] = useState("All Quizzes");
    const [filterCategory, setFilterCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("Popular");

    const filtered = quizData
        .filter(
            (q) =>
                (filterCategory === "All" || q.category === filterCategory) &&
                q.title.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "Popular") return b.enrolled - a.enrolled;
            if (sortBy === "Rating") return b.rating - a.rating;
            if (sortBy === "Newest") return a.title.localeCompare(b.title);
            return 0;
        });

    return (
        <div className="student-dashboard">
            <Container fluid="sm">
                {/* HERO CAROUSEL */}
                <Carousel fade interval={5000} indicators={false} className="hero-carousel mb-5">
                    {quizData.slice(0, 3).map((quiz, i) => (
                        <Carousel.Item key={i}>
                            <div
                                className="hero-slide"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${quiz.thumbnail})`,
                                }}
                            >
                                <div className="hero-content">
                                    <h2 className="fw-bold mb-2">{quiz.title}</h2>
                                    <p className="mb-3">{quiz.author} • {quiz.category}</p>
                                    <Button className="btn-gradient">
                                        <FaPlay className="me-2" /> Start Now
                                    </Button>
                                </div>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>

                {/* CATEGORY TAGS */}
                <div className="category-scroll mb-4">
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            variant={filterCategory === cat ? "gradient-active" : "outline-light"}
                            className="rounded-pill me-2"
                            onClick={() => setFilterCategory(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>

                {/* NAV TABS */}
                <Nav variant="tabs" className="quiz-tabs mb-4">
                    {["All Quizzes", "Free", "Purchased", "Popular"].map((tab) => (
                        <Nav.Item key={tab}>
                            <Nav.Link
                                active={activeTab === tab}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>

                {/* SEARCH + SORT BAR */}
                <div className="filter-bar d-flex flex-wrap gap-3 mb-4 align-items-center">
                    <InputGroup className="search-box flex-grow-1 flex-sm-grow-0">
                        <InputGroup.Text className="bg-dark text-light border-secondary">
                            <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search quizzes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-dark text-light border-secondary"
                        />
                    </InputGroup>

                    <Dropdown>
                        <Dropdown.Toggle variant="outline-light">
                            Sort by: {sortBy}
                        </Dropdown.Toggle>
                        <Dropdown.Menu variant="dark">
                            {["Popular", "Rating", "Newest"].map((s) => (
                                <Dropdown.Item key={s} onClick={() => setSortBy(s)}>
                                    {s}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                {/* QUIZ GRID */}
                <Row className="g-4">
                    {filtered.map((quiz, i) => (
                        <Col xs={12} sm={6} lg={4} xl={3} key={i}>
                            <Card className="quiz-card bg-dark border-0 shadow-sm h-100 overflow-hidden">
                                <div
                                    className="quiz-thumbnail"
                                    style={{ backgroundImage: `url(${quiz.thumbnail})` }}
                                ></div>
                                <Card.Body className="p-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Badge bg="secondary">{quiz.category}</Badge>
                                        <span className="text-warning small">
                                            <FaStar className="me-1" />
                                            {quiz.rating}
                                        </span>
                                    </div>

                                    <h6 className="fw-semibold text-white">{quiz.title}</h6>
                                    <p className="small text-secondary mb-3">{quiz.author}</p>

                                    <div className="d-flex flex-wrap small text-white-50 mb-3 gap-2">
                                        <span>
                                            <FaClock className="me-1" />
                                            {quiz.time}
                                        </span>
                                        <span>
                                            <FaBookOpen className="me-1" />
                                            {quiz.questions} Qs
                                        </span>
                                        <span>
                                            <FaUser className="me-1" />
                                            {quiz.enrolled}
                                        </span>
                                    </div>

                                    {quiz.price > 0 ? (
                                        <h6 className="text-gradient fw-bold mb-2">
                                            {quiz.price.toLocaleString("vi-VN")} ₫
                                        </h6>
                                    ) : (
                                        <h6 className="text-success fw-bold mb-2">Free</h6>
                                    )}

                                    <Button className="btn-gradient w-100">
                                        {quiz.price > 0 ? "Buy Quiz" : "Start Quiz"}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}

                    {filtered.length === 0 && (
                        <p className="text-center text-secondary mt-5">
                            No quizzes found matching your filters.
                        </p>
                    )}
                </Row>
            </Container>
        </div>
    );
}

export default StudentQuizDashboard;
