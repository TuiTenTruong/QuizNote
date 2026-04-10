import { useState, useEffect } from "react";
import { Row, Col, Card, Button, Badge, Pagination, Dropdown, Form } from "react-bootstrap";
import { FaBookOpen, FaUser, FaFilter, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSellerSubjectsQuery } from "../../hooks/useSubject";
import { useDebouncedValue } from "../../hooks/useSeller";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import styles from "./scss/SellerQuizzes.module.scss";

const SellerQuizzesSection = () => {
    const [filteredQuizList, setFilteredQuizList] = useState<any[]>([]);
    const [filter, setFilter] = useState("All");
    const [priceRange, setPriceRange] = useState("Tat ca");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState<number | null>(null);
    const seller = useSelector((state: any) => state.user.account);
    const { subjects: quizList, loading, error, refetch } = useSellerSubjectsQuery(seller?.id);
    const debouncedSearch = useDebouncedValue(search, 500);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        let filtered = [...quizList];

        if (filter !== "All") {
            filtered = filtered.filter((quiz) =>
                filter === "Published" ? quiz.status === "ACTIVE" : quiz.status === "DRAFT"
            );
        }

        if (debouncedSearch.trim()) {
            filtered = filtered.filter((quiz) =>
                quiz.name.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
        }

        if (priceRange !== "Tat ca") {
            filtered = filtered.filter((quiz) => {
                const price = quiz.price || 0;
                switch (priceRange) {
                    case "Mien phi":
                        return price === 0;
                    case "Duoi 50k":
                        return price > 0 && price < 50000;
                    case "50k - 100k":
                        return price >= 50000 && price <= 100000;
                    case "Tren 100k":
                        return price > 100000;
                    default:
                        return true;
                }
            });
        }

        setFilteredQuizList(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setCurrentPage(1);
    }, [quizList, filter, debouncedSearch, priceRange]);

    const handleClearFilters = () => {
        setFilter("All");
        setPriceRange("Tat ca");
        setSearch("");
        setCurrentPage(1);
    };

    const handleDeleteClick = (quizId: number) => {
        setQuizToDelete(quizId);
        setShowDeleteModal(true);
    };

    const handleModalClose = () => {
        setShowDeleteModal(false);
        setQuizToDelete(null);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredQuizList.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className={styles.sellerQuizzes}>
            <h3 className="fw-bold mb-3 text-white text-center text-md-start">Mon hoc cua toi</h3>
            <p className="text-secondary mb-4 text-center text-md-start">Duyet va quan ly tat ca mon hoc cua ban.</p>

            <div className="filter-bar d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-4">
                <div className="btn-group w-100 w-md-auto" role="group">
                    {["All", "Published", "Draft"].map((tab) => (
                        <Button
                            key={tab}
                            variant={filter === tab ? "gradient-active" : "outline-light"}
                            className={`flex-fill text-capitalize ${filter === tab ? "active" : ""}`}
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
                    />
                    <Dropdown onSelect={(value) => setPriceRange(value || "Tat ca")}>
                        <Dropdown.Toggle variant="outline-light" id="dropdown-price-filter" className="w-100 w-sm-auto">
                            <FaFilter className="me-2" /> {priceRange}
                        </Dropdown.Toggle>
                        <Dropdown.Menu variant="dark">
                            <Dropdown.Item eventKey="Tat ca" active={priceRange === "Tat ca"}>Tat ca</Dropdown.Item>
                            <Dropdown.Item eventKey="Mien phi" active={priceRange === "Mien phi"}>Mien phi</Dropdown.Item>
                            <Dropdown.Item eventKey="Duoi 50k" active={priceRange === "Duoi 50k"}>Duoi 50k</Dropdown.Item>
                            <Dropdown.Item eventKey="50k - 100k" active={priceRange === "50k - 100k"}>50k - 100k</Dropdown.Item>
                            <Dropdown.Item eventKey="Tren 100k" active={priceRange === "Tren 100k"}>Tren 100k</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    {(filter !== "All" || priceRange !== "Tat ca" || search) && (
                        <Button variant="outline-secondary" className="w-100 w-sm-auto" onClick={handleClearFilters}>
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            <Row className="g-3">
                {loading && <p className="text-center text-secondary mt-4">Dang tai mon hoc...</p>}
                {error && <p className="text-center text-danger mt-4">Loi: {error}</p>}

                {!loading && currentItems.map((quiz, i) => (
                    <Col xs={12} key={i}>
                        <Card className="quiz-item bg-dark border-light p-3 p-sm-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                                <div className="d-flex gap-3 align-items-start w-100" onClick={() => navigate(`/seller/detail/${quiz.id}`)}>
                                    <div className="icon-box d-none d-sm-flex">
                                        <FaBookOpen size="1.3em" />
                                    </div>
                                    <div className="quiz-info flex-grow-1">
                                        <h6 className="fw-semibold mb-1 text-white">{quiz.name}</h6>
                                        <p className="text-secondary small mb-2 text-ellipsis">{quiz.description}</p>
                                        <div className="quiz-meta d-flex flex-wrap gap-3 small text-white-50">
                                            <span><FaUser className="me-1" /> {quiz.purchaseCount || 0} luot mua</span>
                                            <span>{quiz.questionCount || 0} cau hoi</span>
                                            <span>{(quiz.price || 0).toLocaleString("vi-VN")} VND</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="quiz-actions d-flex justify-content-end align-items-center gap-1">
                                    <Badge
                                        className="m-0 p-2"
                                        bg={quiz.status === "ACTIVE" ? "success" : quiz.status === "PENDING" ? "warning" : "secondary"}
                                        text={quiz.status === "PENDING" ? "dark" : "light"}
                                    >
                                        {quiz.status?.toLowerCase()}
                                    </Badge>
                                    <Button className="hover-gradient" onClick={() => navigate(`/seller/quizzes/${quiz.id}`)}>Xem</Button>
                                    <Button variant="outline-danger" className="flex-fill flex-sm-grow-0" onClick={() => handleDeleteClick(quiz.id)}>
                                        <FaTrash />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}

                {!loading && !error && filteredQuizList.length === 0 && (
                    <p className="text-center text-secondary mt-4">Khong tim thay mon hoc nao phu hop voi bo loc nay.</p>
                )}
            </Row>

            {totalPages > 1 && (
                <div className="d-flex justify-content-end mt-4">
                    <Pagination>
                        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                        {[...Array(totalPages).keys()].map((page) => (
                            <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => setCurrentPage(page + 1)}>
                                {page + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>
            )}

            <DeleteConfirmModal
                show={showDeleteModal}
                onHide={handleModalClose}
                quizId={quizToDelete}
                onDeleteSuccess={refetch}
            />
        </div>
    );
};

export default SellerQuizzesSection;
