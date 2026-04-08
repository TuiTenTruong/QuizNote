import { useState } from "react";
import { Container, Form, Dropdown, Row, Col, Card, Badge, Spinner } from "react-bootstrap";
import { FaBook, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ISubmission, SubmissionStatus } from "../../types";
import styles from "./StudentHistorySection.module.scss";

const statusMap: Record<SubmissionStatus, string> = {
    SUBMITTED: "Hoàn thành",
    IN_PROGRESS: "Đang làm",
    EXPIRED: "Hết hạn"
};

const statusVariantMap: Record<SubmissionStatus, "success" | "warning" | "danger"> = {
    SUBMITTED: "success",
    IN_PROGRESS: "warning",
    EXPIRED: "danger"
};

const filterOptions = ["Tất cả", "Hoàn thành", "Đang làm"];

interface IProps {
    historyData: ISubmission[] | null;
    loading: boolean;
}

export const StudentHistorySection: React.FC<IProps> = ({ historyData, loading }: IProps) => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("Tất cả");
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const getStatusText = (status: SubmissionStatus): string => statusMap[status] ?? "Không xác định";

    const getStatusVariant = (status: SubmissionStatus): "success" | "warning" | "danger" => statusVariantMap[status] ?? "warning";

    const filtered = historyData?.filter((h) => {
        const statusText = getStatusText(h.status);
        const matchesFilter = filter === "Tất cả" || statusText === filter;
        const quizTitle = h.currentSubject?.name || "";
        const matchesSearch = quizTitle.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const formatTime = (seconds?: number | null): string => {
        if (!seconds) return "0:00:00";
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div>
                <div className="bg-black text-light min-vh-100 py-4">
                    <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                        <Spinner animation="border" variant="primary" />
                    </Container>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.studentHistory} py-4`}>
            <Container fluid className="px-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                    <h4 className="fw-bold m-0 text-gradient">Lịch sử học tập</h4>

                    <div className="d-flex gap-3 ">
                        <Form.Control
                            type="text"
                            placeholder="Tìm quiz..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-dark text-light border-secondary"
                            style={{ maxWidth: "250px" }}
                        />
                        <Dropdown>
                            <Dropdown.Toggle variant="outline-light" id="filter-dropdown">
                                {filter}
                            </Dropdown.Toggle>
                            <Dropdown.Menu variant="dark">
                                {filterOptions.map((option) => (
                                    <Dropdown.Item
                                        key={option}
                                        active={option === filter}
                                        onClick={() => setFilter(option)}
                                    >
                                        {option}
                                    </Dropdown.Item>))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                {/* List */}
                <Row className="g-4">
                    {filtered?.map((item) => (
                        <Col xs={12} md={6} lg={6} key={item.id}>
                            <Card className={`bg-dark border-secondary text-light h-100 ${styles.quizHistoryCard}`}>
                                <Card.Body
                                    onClick={() => {
                                        if (item.status !== "SUBMITTED") return;
                                        queryClient.setQueryData(["submissionHistoryItem", item.id], item);
                                        navigate(`/student/history/quiz/${item.id}`);
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <Card.Title className="fs-5 fw-semibold mb-0 flex-grow-1">
                                            {item.currentSubject?.name || "Quiz không có tiêu đề"}
                                        </Card.Title>
                                        <Badge bg={getStatusVariant(item.status)} className="ms-2">
                                            {getStatusText(item.status)}
                                        </Badge>
                                    </div>

                                    <div className="d-flex flex-column gap-2 mt-3">
                                        <div className="d-flex justify-content-between small">
                                            <span className="text-white-50 ">

                                                {item.submittedAt
                                                    ? <><div className="d-flex align-items-center"><FaClock className="me-1" /> Đã nộp: {item.submittedAt}</div>
                                                        <div>Thời gian làm: {item.duration} phút</div>
                                                        <div>Thời gian hoàn thành: {formatTime(item.timeSpent)}</div></>
                                                    : (<div>Bắt đầu: {item.startedAt}</div>)
                                                }
                                            </span>
                                        </div>
                                        <div>

                                        </div>
                                        {item.status === "SUBMITTED" && item.score !== null && (
                                            <div className="d-flex  align-items-center gap-1">
                                                <span className="small text-white-50">Điểm số:</span>
                                                <span className="text-info">{item.score} điểm</span>
                                            </div>
                                        )}

                                        {item.mode && (
                                            <div className="d-flex justify-content-between small">
                                                <span className="text-white-50">Chế độ:</span>
                                                <span className="fst-italic text-info">
                                                    {item.mode === "PRACTICE" ? "Luyện tập" : "Thi thử"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}

                    {filtered?.length === 0 && !loading && (
                        <Col xs={12}>
                            <p className="text-center text-secondary mt-4">
                                {search || filter !== "Tất cả"
                                    ? "Không tìm thấy kết quả phù hợp."
                                    : "Bạn chưa có lịch sử làm quiz nào."}
                            </p>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    );
}