import { useState } from "react";
import type { ChangeEvent, ReactElement } from "react";
import { Carousel, Button, Nav, InputGroup, Form, Dropdown, Row, Col, Card, Container } from "react-bootstrap";
import { FaPlay, FaSearch, FaStar, FaUser, FaUsers } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosCustomize";
import type { ISubject, QuizItem } from "../../types";
import styles from "./StudentExplore.module.scss";
interface IProps {
    subjectsData: ISubject[];
    myQuizzes: QuizItem[];
    isLoading: boolean;
}

type ExploreTab = "All Quizzes" | "Free" | "Purchased" | "Popular";
type SortBy = "Popular" | "Rating" | "Newest" | "Price: Low to High" | "Price: High to Low";

const exploreTabs: Array<{ key: ExploreTab; label: string }> = [
    { key: "All Quizzes", label: "Tất cả" },
    { key: "Free", label: "Miễn phí" },
    { key: "Purchased", label: "Đã mua" },
    { key: "Popular", label: "Phổ biến" }
];

const sortOptions: Array<{ key: SortBy; label: string }> = [
    { key: "Popular", label: "Phổ biến" },
    { key: "Rating", label: "Đánh giá cao" },
    { key: "Newest", label: "Mới nhất" },
    { key: "Price: Low to High", label: "Giá: Thấp → Cao" },
    { key: "Price: High to Low", label: "Giá: Cao → Thấp" }
];

const StudentExploreSection = ({ subjectsData, myQuizzes, isLoading }: IProps): ReactElement => {
    const [activeTab, setActiveTab] = useState<ExploreTab>("All Quizzes");
    const navigate = useNavigate();
    const [search, setSearch] = useState<string>("");
    const [sortBy, setSortBy] = useState<SortBy>("Popular");
    const backendBaseURL = axiosInstance.defaults.baseURL + "storage/subjects/";

    const hasPurchased = (subjectId: number): boolean => {
        return myQuizzes.some(quiz => quiz.id === subjectId);
    };

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setSearch(e.target.value);
    };

    const filtered = subjectsData
        .filter((subject: ISubject) => {

            const matchesSearch =
                subject.name.toLowerCase().includes(search.toLowerCase()) ||
                subject.description?.toLowerCase().includes(search.toLowerCase()) ||
                subject.createUser?.username?.toLowerCase().includes(search.toLowerCase());


            let matchesTab = true;
            if (activeTab === "Free") {
                matchesTab = subject.price === 0;
            } else if (activeTab === "Purchased") {
                matchesTab = hasPurchased(subject.id);
            } else if (activeTab === "Popular") {
                matchesTab = (subject.purchaseCount || 0) > 0 || (subject.ratingCount || 0) > 0;
            }
            // "All Quizzes" tab shows everything

            return matchesSearch && matchesTab;
        })
        .sort((a: ISubject, b: ISubject) => {
            if (sortBy === "Popular") {
                // Sort by purchase count first, then rating count
                const popularityA = (a.purchaseCount || 0) * 2 + (a.ratingCount || 0);
                const popularityB = (b.purchaseCount || 0) * 2 + (b.ratingCount || 0);
                return popularityB - popularityA;
            }
            if (sortBy === "Rating") {
                // Sort by average rating, then by rating count
                if (b.averageRating !== a.averageRating) {
                    return (b.averageRating || 0) - (a.averageRating || 0);
                }
                return (b.ratingCount || 0) - (a.ratingCount || 0);
            }
            if (sortBy === "Newest") {
                // Sort by creation date (newest first)
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            if (sortBy === "Price: Low to High") {
                return (a.price || 0) - (b.price || 0);
            }
            if (sortBy === "Price: High to Low") {
                return (b.price || 0) - (a.price || 0);
            }
            return 0;
        });
    if (isLoading) {
        return (
            <Container className="text-center py-5">
                <p className="text-light">Đang tải môn học...</p>
            </Container>
        );
    }
    return (
        <div className={`${styles.studentExplore} p-4`}>
            <div>
                {/* HERO CAROUSEL */}
                <Carousel fade interval={5000} indicators={false} className={`${styles.heroCarousel} mb-5`}>
                    {subjectsData.slice(0, 3).map((subject, i) => (
                        <Carousel.Item key={i} onClick={(e) => e.stopPropagation()}>
                            <div
                                className={styles.heroSlide}
                                style={{
                                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backendBaseURL + subject.imageUrl})`,
                                }}
                            >
                                <div className={styles.heroContent}>
                                    <h2 className="fw-bold mb-2">{subject.name}</h2>
                                    <p className="mb-3">{subject.createUser?.username}</p>
                                    <Button className={`${styles.btnGradient} z-5`} onClick={() => {
                                        navigate(`/student/quizzes/${subject.id}`);
                                    }}>
                                        <FaPlay className="me-2" /> Start Now
                                    </Button>
                                </div>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>

                {/* NAV TABS */}
                <Nav variant="tabs" className={`${styles.quizTabs} mb-4`}>
                    {exploreTabs.map((tab) => (
                        <Nav.Item key={tab.key}>
                            <Nav.Link
                                active={activeTab === tab.key}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>

                {/* SEARCH + SORT BAR */}
                <div className={`${styles.filterBar} d-flex flex-wrap gap-3 mb-4 align-items-center`}>
                    <InputGroup className={`${styles.searchBox} flex-grow-1 flex-sm-grow-0`}>
                        <InputGroup.Text className="bg-dark text-light border-secondary">
                            <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Tìm kiếm môn học theo tên, mô tả hoặc tác giả..."
                            value={search}
                            onChange={handleSearchChange}
                            className="bg-dark text-light border-secondary"
                        />
                    </InputGroup>

                    <Dropdown>
                        <Dropdown.Toggle variant="outline-light">
                            Sắp xếp: {
                                sortBy === "Popular" ? "Phổ biến" :
                                    sortBy === "Rating" ? "Đánh giá cao" :
                                        sortBy === "Newest" ? "Mới nhất" :
                                            sortBy === "Price: Low to High" ? "Giá: Thấp → Cao" :
                                                sortBy === "Price: High to Low" ? "Giá: Cao → Thấp" :
                                                    sortBy
                            }
                        </Dropdown.Toggle>
                        <Dropdown.Menu variant="dark">
                            {sortOptions.map((s) => (
                                <Dropdown.Item key={s.key} onClick={() => setSortBy(s.key)}>
                                    {s.label}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                {/* QUIZ GRID */}
                <Row className="g-4">
                    {filtered.map((subject) => (
                        <Col xs={12} sm={6} lg={4} xl={3} key={subject.id}>
                            <Card className={`${styles.quizCard} bg-dark border-0 shadow-sm h-100 overflow-hidden`} as={Link}
                                to={`/student/quizzes/${subject.id}`} state={{ hasPurchased: hasPurchased(subject.id) || subject.price === 0 }}>
                                <div
                                    className={styles.quizThumbnail}
                                    style={{ backgroundImage: `url(${backendBaseURL + subject.imageUrl})` }}
                                ></div>
                                <Card.Body className="p-3">
                                    <div className={styles.quizCardHeader}>
                                        {subject.averageRating ?
                                            <span className={styles.rating}>
                                                <FaStar />
                                                {subject.averageRating.toFixed(1)}
                                            </span> : <div className={styles.noRatings}>Chưa có đánh giá nào.</div>}



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
                                            <span className={styles.noStudents}>
                                                <span className={styles.noStudentsText}>Chưa có học viên nào.</span>
                                            </span>}
                                    </div>



                                    {subject.price > 0 ? (
                                        <h6 className={`${styles.textGradient} fw-bold mb-2`}>
                                            {subject.price.toLocaleString("vi-VN")} ₫
                                        </h6>
                                    ) : (
                                        <h6 className="text-success fw-bold mb-2">Free</h6>
                                    )}

                                    <Button className={`${styles.btnGradient} w-100`}>
                                        {hasPurchased(subject.id) || subject.price === 0 ? "Bắt đầu" : "Mua Ngay"}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}

                    {filtered.length === 0 && (
                        <p className="text-center text-secondary mt-5">
                            Không tìm thấy môn học nào phù hợp với bộ lọc của bạn.
                        </p>
                    )}
                </Row>
            </div>
        </div>
    );
}

export default StudentExploreSection;
