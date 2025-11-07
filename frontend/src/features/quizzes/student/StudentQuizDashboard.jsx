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
    FaStar,
    FaUser,
    FaPlay,
    FaUsers
} from "react-icons/fa";
import "./StudentQuizDashboard.scss";
import { useEffect } from "react";
import { getAllSubjects, fetchMyQuizzes } from "../../../services/apiService";
import axiosInstance from "../../../utils/axiosCustomize";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const categories = ["All", "Math", "Biology", "Language", "History", "Chemistry"];

const StudentQuizDashboard = () => {
    const [activeTab, setActiveTab] = useState("All Quizzes");
    const [filterCategory, setFilterCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("Popular");
    const [subjectsData, setSubjectsData] = useState([]);
    const [myQuizzes, setMyQuizzes] = useState([]);
    const backendBaseURL = axiosInstance.defaults.baseURL + "storage/subjects/";

    const user = useSelector((state) => state.user.account);
    console.log("User in Dashboard:", user);
    useEffect(() => {
        const fetchSubjectsData = async () => {
            const response = await getAllSubjects();
            if (response && response.statusCode === 200) {
                setSubjectsData(response.data.result);
            } else {
                console.error('Failed to fetch quiz data', response);
            }
        };
        fetchSubjectsData();
    }, []);

    if (user !== null) {
        useEffect(() => {
            const getMyQuizzes = async () => {
                try {
                    const response = await fetchMyQuizzes(user.id);
                    setMyQuizzes(response.data);
                } catch (err) {
                    console.error("Error fetching my quizzes:", err);
                }
            };
            getMyQuizzes();
        }, [user]);
    }

    // Helper function to check if user has purchased a quiz
    const hasPurchased = (subjectId) => {
        if (!myQuizzes || !Array.isArray(myQuizzes)) return false;
        return myQuizzes.some(quiz => quiz.id === subjectId);
    };

    console.log("My Quizzes in Dashboard:", myQuizzes);
    console.log("Subjects Data in Dashboard:", subjectsData);

    const filtered = subjectsData
        .filter(
            (q) =>
                (filterCategory === "All" || q.category === filterCategory) &&
                q.name.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "Popular") return b.ratingCount - a.ratingCount; // Assuming ratingCount can represent popularity
            if (sortBy === "Rating") return b.averageRating - a.averageRating;
            if (sortBy === "Newest") return a.name.localeCompare(b.name);
            return 0;
        });

    return (
        <div className="student-dashboard p-4">
            <div>
                {/* HERO CAROUSEL */}
                <Carousel fade interval={5000} indicators={false} className="hero-carousel mb-5">
                    {subjectsData.slice(0, 3).map((subject, i) => (
                        <Carousel.Item key={i}>
                            <div
                                className="hero-slide"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backendBaseURL + subject.imageUrl})`,
                                }}
                            >
                                <div className="hero-content">
                                    <h2 className="fw-bold mb-2">{subject.name}</h2>
                                    <p className="mb-3">{subject.createUser?.username}</p>
                                    <Button className="btn-gradient" as={Link} to={`/student/quizzes/${subject.id}`}>
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
                    {filtered.map((subject) => (
                        <Col xs={12} sm={6} lg={4} xl={3} key={subject.id}>
                            <Card className="quiz-card bg-dark border-0 shadow-sm h-100 overflow-hidden" as={Link}
                                to={`/student/quizzes/${subject.id}`} state={{ hasPurchased: hasPurchased(subject.id) || subject.price === 0 }}>
                                <div
                                    className="quiz-thumbnail"
                                    style={{ backgroundImage: `url(${backendBaseURL + subject.imageUrl})` }}
                                ></div>
                                <Card.Body className="p-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        {subject.averageRating ?
                                            <span className="text-warning small d-flex align-items-center gap-1">
                                                <FaStar />
                                                {subject.averageRating.toFixed(1)}

                                            </span> : <div className="muted">Chưa có đánh giá nào.</div>}



                                    </div>

                                    <h6 className="fw-semibold text-white">{subject.name}</h6>
                                    <p className="small text-secondary mb-3">{subject.createUser?.username}</p>

                                    <div className="small text-white-50 mb-3 gap-2">
                                        <span className="d-flex align-items-center gap-1">
                                            <FaUser className="me-1" />
                                            {subject.ratingCount} ratings
                                        </span>
                                        {subject.purchaseCount > 0 ? (
                                            <span className="d-flex align-items-center gap-1">
                                                <FaUsers className="me-1" />
                                                {subject.purchaseCount} students enrolled
                                            </span>
                                        ) :
                                            <span className="muted align-items-center gap-1">
                                                <span className="muted">Chưa có học viên nào.</span>
                                            </span>}
                                    </div>



                                    {subject.price > 0 ? (
                                        <h6 className="text-gradient fw-bold mb-2">
                                            {subject.price.toLocaleString("vi-VN")} ₫
                                        </h6>
                                    ) : (
                                        <h6 className="text-success fw-bold mb-2">Free</h6>
                                    )}

                                    <Button className="btn-gradient w-100">
                                        {hasPurchased(subject.id) || subject.price === 0 ? "Bắt đầu" : "Mua Ngay"}
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
            </div>
        </div>
    );
}

export default StudentQuizDashboard;
