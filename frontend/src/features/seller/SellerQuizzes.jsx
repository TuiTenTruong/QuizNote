import { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Badge,
    Pagination,
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
import { useSelector } from "react-redux";
import { getSubjectBySellerId } from "../../services/apiService";
const SellerQuizzes = () => {
    const [quizList, setQuizList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
    const seller = useSelector(state => state.user.account);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getSubjectBySellerId(seller.id, currentPage);
                setQuizList(response.data.result);
                setTotalPages(response.data.meta.pages);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load quizzes.");
                setQuizList([]);
            } finally {
                setLoading(false);
            }
        };

        if (seller?.id) {
            fetchQuizzes();
        }
    }, [seller?.id, currentPage, search, filter]);
    const filteredQuizzes = quizList.filter(
        (quiz) =>
            (filter === "All" || quiz.status === filter) &&
            quiz.name.toLowerCase().includes(search.toLowerCase())
    );
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
                            className="flex-fill text-capitalize"
                            onClick={() => handleFilterChange(tab)}
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
                {loading && (
                    <p className="text-center text-secondary mt-4">Loading quizzes...</p>
                )}

                {error && (
                    <p className="text-center text-danger mt-4">Error: {error}</p>
                )}

                {!loading && quizList.map((quiz, i) => (
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
                                            {quiz.name}
                                        </h6>
                                        <p className="text-secondary small mb-2">{quiz.description}</p>
                                        <div className="quiz-meta d-flex flex-wrap gap-3 small text-white-50">
                                            <span>
                                                <FaUser className="me-1" /> {quiz.completions || 0} users
                                            </span>
                                            <span>
                                                <FaClock className="me-1" /> {quiz.duration || 'N/A'}
                                            </span>
                                            <span>{quiz.questionCount || 0} questions</span>
                                            <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT */}
                                <div className="quiz-actions d-flex justify-content-end align-items-center gap-1">
                                    <Badge className="m-0 p-2"
                                        bg={quiz.status === "ACTIVE" ? "success"
                                            : quiz.status === "PENDING" ? "warning"
                                                : "secondary"}
                                        text={
                                            quiz.status === "PENDING" ? "dark" : "light"
                                        }
                                    >
                                        {quiz.status?.toLowerCase()}
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

                {!loading && !error && quizList.length === 0 && (
                    <p className="text-center text-secondary mt-4">
                        No quizzes found for this filter.
                    </p>
                )}
            </Row>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        {[...Array(totalPages).keys()].map((page) => (
                            <Pagination.Item
                                key={page + 1}
                                active={page + 1 === currentPage}
                                onClick={() => handlePageChange(page + 1)}
                            >
                                {page + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>
            )}
        </div>
    );
}

export default SellerQuizzes;
