import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Container,
    Pagination,
    Row,
    Spinner,
    Table,
} from "react-bootstrap";
import {
    FaArrowLeft,
    FaBoxOpen,
    FaCalendar,
    FaCheckCircle,
    FaCoins,
    FaGift,
    FaHourglassHalf,
    FaMapMarkerAlt,
    FaPhone,
    FaTimesCircle,
    FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosCustomize";
import { getMyRewardTransactions } from "../../api/reward.api";
import { parseRewardDeliveryInfo } from "../../hooks/useMyRewardTransactions";
import type { IRewardTransaction, IRewardUiAlert, RewardTransactionStatus } from "../../types/reward";
import "./scss/MyRewardTransactionsSection.scss";

const DEFAULT_PAGE_SIZE = 10;

const MyRewardTransactionsSection = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<IRewardTransaction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<IRewardUiAlert | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);

    const backendBaseURL = useMemo(() => `${axiosInstance.defaults.baseURL}storage/rewards/`, []);

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getMyRewardTransactions(currentPage, DEFAULT_PAGE_SIZE);
            setTransactions(response.data?.result || []);
            setTotalPages(response.data?.meta?.pages || 0);
            setTotalElements(response.data?.meta?.total || 0);
        } catch (error) {
            console.error("Failed to fetch reward transactions:", error);
            setAlert({ type: "danger", text: "Khong the tai danh sach giao dich" });
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        void fetchTransactions();
    }, [fetchTransactions]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const getStatusBadge = (status: RewardTransactionStatus) => {
        if (status === "COMPLETED") {
            return (
                <Badge bg="success" pill>
                    <FaCheckCircle className="me-1" />
                    Hoan thanh
                </Badge>
            );
        }

        if (status === "PENDING") {
            return (
                <Badge bg="warning" text="dark" pill>
                    <FaHourglassHalf className="me-1" />
                    Dang xu ly
                </Badge>
            );
        }

        if (status === "CANCELLED") {
            return (
                <Badge bg="danger" pill>
                    <FaTimesCircle className="me-1" />
                    Da huy
                </Badge>
            );
        }

        return <Badge bg="secondary">{status}</Badge>;
    };

    const renderPagination = () => {
        if (totalPages <= 1) {
            return null;
        }

        const items: React.ReactNode[] = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(0, endPage - maxPagesToShow + 1);
        }

        if (currentPage > 0) {
            items.push(<Pagination.First key="first" onClick={() => handlePageChange(0)} />);
            items.push(<Pagination.Prev key="prev" onClick={() => handlePageChange(currentPage - 1)} />);
        }

        for (let page = startPage; page <= endPage; page += 1) {
            items.push(
                <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => handlePageChange(page)}
                >
                    {page + 1}
                </Pagination.Item>
            );
        }

        if (currentPage < totalPages - 1) {
            items.push(<Pagination.Next key="next" onClick={() => handlePageChange(currentPage + 1)} />);
            items.push(<Pagination.Last key="last" onClick={() => handlePageChange(totalPages - 1)} />);
        }

        return <Pagination className="custom-pagination justify-content-center mt-4">{items}</Pagination>;
    };

    return (
        <div className="my-reward-transactions-page">
            <Container fluid className="py-4">
                <Row className="mb-4">
                    <Col>
                        <Button size="sm" onClick={() => navigate(-1)} className="mb-3 btn-outline-gradient">
                            <FaArrowLeft className="me-2" />
                            Quay lai
                        </Button>
                        <h2 className="fw-bold mb-1 text-gradient">Lich Su Doi Thuong</h2>
                        <p className="text-muted mb-0">Xem lai cac giao dich doi qua tang cua ban.</p>
                    </Col>
                    <Col xs="auto" className="d-flex align-items-center">
                        <div className="stats-box">
                            <div className="text-secondary small mb-1">Tong giao dich</div>
                            <div className="fw-bold fs-4 text-light">{totalElements}</div>
                        </div>
                    </Col>
                </Row>

                {alert && (
                    <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible className="mb-3">
                        {alert.text}
                    </Alert>
                )}

                <Card className="bg-dark text-light border-0 shadow-sm transactions-card">
                    <Card.Body>
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="light" />
                                <div className="mt-3 text-secondary">Dang tai du lieu...</div>
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive">
                                    <Table hover className="align-middle transactions-table mb-0">
                                        <thead>
                                            <tr>
                                                <th className="bg-dark text-light">ID</th>
                                                <th className="bg-dark text-light">Qua tang</th>
                                                <th className="bg-dark text-light">Hinh anh</th>
                                                <th className="bg-dark text-light">Gia xu</th>
                                                <th className="bg-dark text-light">Nguoi nhan</th>
                                                <th className="bg-dark text-light">Thoi gian</th>
                                                <th className="bg-dark text-light">Trang thai</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="text-center py-4 bg-dark text-light">
                                                        <FaBoxOpen size={40} className="text-muted mb-2" />
                                                        <div className="text-secondary">Ban chua co giao dich nao</div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                transactions.map((transaction) => {
                                                    const deliveryInfo = parseRewardDeliveryInfo(transaction.deliveryInfo);
                                                    return (
                                                        <tr key={transaction.id}>
                                                            <td className="bg-dark text-light">#{transaction.id}</td>
                                                            <td className="bg-dark text-light">
                                                                <div className="fw-semibold">{transaction.reward?.name || "N/A"}</div>
                                                            </td>
                                                            <td className="bg-dark text-light">
                                                                {transaction.reward?.imageUrl ? (
                                                                    <img
                                                                        src={`${backendBaseURL}${transaction.reward.imageUrl}`}
                                                                        alt={transaction.reward?.name}
                                                                        className="transaction-thumb"
                                                                    />
                                                                ) : (
                                                                    <div className="transaction-thumb placeholder">
                                                                        <FaGift className="text-muted" />
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="bg-dark text-light">
                                                                <Badge bg="warning" text="dark" className="px-3 py-2 fs-6">
                                                                    <FaCoins className="me-1" />
                                                                    {transaction.coinsCost || 0}
                                                                </Badge>
                                                            </td>
                                                            <td className="bg-dark text-light">
                                                                <div className="small">
                                                                    <div className="mb-1">
                                                                        <FaUser className="me-1 text-muted" />
                                                                        {deliveryInfo.name}
                                                                    </div>
                                                                    <div className="mb-1">
                                                                        <FaPhone className="me-1 text-muted" />
                                                                        {deliveryInfo.phone}
                                                                    </div>
                                                                    <div className="text-muted" style={{ maxWidth: 200 }}>
                                                                        <FaMapMarkerAlt className="me-1" />
                                                                        {deliveryInfo.address}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="bg-dark text-light">
                                                                <div className="d-flex align-items-center text-muted">
                                                                    <FaCalendar className="me-2" />
                                                                    <small>{transaction.redeemedAt || "-"}</small>
                                                                </div>
                                                            </td>
                                                            <td className="bg-dark text-light">{getStatusBadge(transaction.status)}</td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                                {renderPagination()}
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default MyRewardTransactionsSection;
