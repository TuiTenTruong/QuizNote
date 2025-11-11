import { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Badge,
    Form,
    Dropdown,
} from "react-bootstrap";
import { FaBook, FaClock } from "react-icons/fa";
import "./StudentHistory.scss";
import { getHistoryUser } from "../../services/apiService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const StudentHistory = () => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("Tất cả");
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const account = useSelector(state => state.user.account);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchHistoryData = async () => {
            if (!account || !account.id) return;

            try {
                setLoading(true);
                const response = await getHistoryUser(account.id);
                console.log("History data:", response.data);
                setHistoryData(response.data || []);
            } catch (error) {
                console.error("Error fetching history:", error);
                setHistoryData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchHistoryData();
    }, [account]);

    const getStatusText = (status) => {
        switch (status) {
            case "SUBMITTED":
                return "Hoàn thành";
            case "IN_PROGRESS":
                return "Đang làm";
            default:
                return status;
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case "SUBMITTED":
                return "success";
            case "IN_PROGRESS":
                return "warning";
            default:
                return "secondary";
        }
    };

    const filtered = historyData.filter((h) => {
        const statusText = getStatusText(h.status);
        const matchesFilter = filter === "Tất cả" || statusText === filter;
        const quizTitle = h.currentSubject?.name || h.name || "";
        const matchesSearch = quizTitle.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const formatTime = (seconds) => {
        console.log("Formatting time for seconds:", seconds);

        if (!seconds) return "0:00:00";
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        console.log("Type of seconds:", secs);
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <Container fluid className="student-history py-4">
                <p className="text-center text-light">Đang tải lịch sử...</p>
            </Container>
        );
    }

    return (
        <div fluid className="student-history py-4">
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
                            <Dropdown.Item onClick={() => setFilter("Tất cả")}>
                                Tất cả
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter("Hoàn thành")}>
                                Hoàn thành
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter("Đang làm")}>
                                Đang làm
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>

            {/* List */}
            <Row className="g-4">
                {filtered.map((item) => (
                    <Col xs={12} md={6} lg={6} key={item.id}>
                        <Card className="bg-dark border-secondary text-light quiz-history-card h-100" >
                            <Card.Body onClick={() => item.status === "SUBMITTED" && navigate("/student/history/quiz/" + item.currentSubject.id, { state: { item } })} style={{ cursor: 'pointer' }}>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <Card.Title className="fs-5 fw-semibold mb-0 flex-grow-1">
                                        {item.currentSubject?.name || "Quiz không có tiêu đề"}
                                    </Card.Title>
                                    <Badge bg={getStatusVariant(item.status)} className="ms-2">
                                        {getStatusText(item.status)}
                                    </Badge>
                                </div>

                                {item.quiz?.subject && (
                                    <Card.Subtitle className="text-secondary mb-2 d-flex align-items-center gap-2">
                                        <FaBook /> {item.quiz.subject.name}
                                    </Card.Subtitle>
                                )}

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

                {filtered.length === 0 && !loading && (
                    <Col xs={12}>
                        <p className="text-center text-secondary mt-4">
                            {search || filter !== "Tất cả"
                                ? "Không tìm thấy kết quả phù hợp."
                                : "Bạn chưa có lịch sử làm quiz nào."}
                        </p>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default StudentHistory;
