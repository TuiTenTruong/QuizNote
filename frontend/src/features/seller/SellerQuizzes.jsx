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
    FaTrash,
} from "react-icons/fa";
import "./SellerQuizzes.scss";
import { FaEllipsisV } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getSubjectBySellerId } from "../../services/apiService";
import { useNavigate } from "react-router-dom";
import { FaDeleteLeft } from "react-icons/fa6";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
const SellerQuizzes = () => {
    const [quizList, setQuizList] = useState([]);
    const [filteredQuizList, setFilteredQuizList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("All");
    const [priceRange, setPriceRange] = useState("All Prices");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
    const [searchDebounced, setSearchDebounced] = useState("");
    const seller = useSelector(state => state.user.account);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState(null);
    const itemsPerPage = 10;
    const navigate = useNavigate();
    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchDebounced(search);
            setCurrentPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getSubjectBySellerId(seller.id);
            setQuizList(response.data.result || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load quizzes.");
            setQuizList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (seller?.id) {
            fetchQuizzes();
        }
    }, [seller?.id, filter]);

    // Client-side filtering
    useEffect(() => {
        let filtered = [...quizList];

        // Status filter
        if (filter !== "All") {
            filtered = filtered.filter(quiz =>
                filter === "Published" ? quiz.status === "ACTIVE" : quiz.status === "DRAFT"
            );
        }
        // Search filter
        if (searchDebounced.trim()) {
            filtered = filtered.filter(quiz =>
                quiz.name.toLowerCase().includes(searchDebounced.toLowerCase())
            );
        }

        // Price range filter
        if (priceRange !== "All Prices") {
            filtered = filtered.filter(quiz => {
                const price = quiz.price || 0;
                switch (priceRange) {
                    case "Free":
                        return price === 0;
                    case "Under 50k":
                        return price > 0 && price < 50000;
                    case "50k - 100k":
                        return price >= 50000 && price <= 100000;
                    case "Over 100k":
                        return price > 100000;
                    default:
                        return true;
                }
            });
        }

        setFilteredQuizList(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setCurrentPage(1);
    }, [quizList, searchDebounced, priceRange]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    const handlePriceRangeChange = (newPriceRange) => {
        setPriceRange(newPriceRange);
    };

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleClearFilters = () => {
        setFilter("All");
        setPriceRange("All Prices");
        setSearch("");
        setCurrentPage(1);
    };

    const handleDeleteClick = (quizId) => {
        setQuizToDelete(quizId);
        setShowDeleteModal(true);
    };

    const handleModalClose = () => {
        setShowDeleteModal(false);
        setQuizToDelete(null);
    };

    const handleDeleteSuccess = () => {
        handleModalClose();
        fetchQuizzes(); // Refresh the list after deletion
    };
    // Get current page items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredQuizList.slice(indexOfFirstItem, indexOfLastItem);

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
                    <Dropdown onSelect={handlePriceRangeChange}>
                        <Dropdown.Toggle
                            variant="outline-light"
                            id="dropdown-price-filter"
                            className="w-100 w-sm-auto"
                        >
                            <FaFilter className="me-2" /> {priceRange}
                        </Dropdown.Toggle>
                        <Dropdown.Menu variant="dark">
                            <Dropdown.Item eventKey="All Prices" active={priceRange === "All Prices"}>
                                All Prices
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="Free" active={priceRange === "Free"}>
                                Free
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="Under 50k" active={priceRange === "Under 50k"}>
                                Under 50k ₫
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="50k - 100k" active={priceRange === "50k - 100k"}>
                                50k - 100k ₫
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="Over 100k" active={priceRange === "Over 100k"}>
                                Over 100k ₫
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    {(filter !== "All" || priceRange !== "All Prices" || search) && (
                        <Button
                            variant="outline-secondary"
                            className="w-100 w-sm-auto"
                            onClick={handleClearFilters}
                        >
                            Clear
                        </Button>
                    )}
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

                {!loading && currentItems.map((quiz, i) => (
                    <Col xs={12} key={i}>
                        <Card className="quiz-item bg-dark border-light p-3 p-sm-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                                {/* LEFT */}
                                <div className="d-flex gap-3 align-items-start w-100" onClick={() => navigate(`/seller/detail/${quiz.id}`)}>
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
                                                <FaUser className="me-1" /> {quiz.purchaseCount || 0} purchases
                                            </span>
                                            <span>
                                                <FaClock className="me-1" /> {quiz.duration ? `${quiz.duration} mins` : 'N/A'}
                                            </span>
                                            <span>{quiz.questionCount || 0} questions</span>
                                            <span>₫{(quiz.price || 0).toLocaleString()}</span>
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
                                        variant="outline-danger"
                                        className="flex-fill flex-sm-grow-0"
                                        onClick={() => handleDeleteClick(quiz.id)}
                                    >
                                        <FaTrash />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}

                {!loading && !error && filteredQuizList.length === 0 && (
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

            <DeleteConfirmModal
                show={showDeleteModal}
                onHide={handleModalClose}
                quizId={quizToDelete}
                onDeleteSuccess={handleDeleteSuccess}
            />
        </div>
    );
}

export default SellerQuizzes;
