import React, { useEffect, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Table,
    Badge,
    Spinner,
    Alert,
    Button,
    Pagination
} from 'react-bootstrap';
import {
    FaGift,
    FaCoins,
    FaCalendar,
    FaCheckCircle,
    FaHourglassHalf,
    FaTimesCircle,
    FaBoxOpen,
    FaArrowLeft,
    FaUser,
    FaPhone,
    FaMapMarkerAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './MyRewardTransactions.scss';
import { getMyRewardTransactions } from '../../services/apiService';
import axiosInstance from '../../utils/axiosCustomize';

const MyRewardTransactions = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;
    const backendBaseURL = axiosInstance.defaults.baseURL + 'storage/rewards/';

    const parseDeliveryInfo = (deliveryInfo) => {
        if (!deliveryInfo) return { name: '-', phone: '-', address: '-' };
        
        const namePart = deliveryInfo.match(/Name:\s*([^,]+)/);
        const phonePart = deliveryInfo.match(/Phone:\s*([^,]+)/);
        const addressPart = deliveryInfo.match(/Address:\s*(.+)/);
        
        return {
            name: namePart ? namePart[1].trim() : '-',
            phone: phonePart ? phonePart[1].trim() : '-',
            address: addressPart ? addressPart[1].trim() : '-'
        };
    };

    useEffect(() => {
        fetchTransactions();
    }, [currentPage]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await getMyRewardTransactions(currentPage, pageSize);
            if (response && response.data) {
                setTransactions(response.data.result || []);
                setTotalPages(response.data.meta?.pages || 0);
                setTotalElements(response.data.meta?.total || 0);
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
            showAlert('danger', 'Không thể tải danh sách giao dịch');
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (type, text) => {
        setAlert({ type, text });
        setTimeout(() => setAlert(null), 5000);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'COMPLETED':
                return (
                    <Badge bg="success" pill>
                        <FaCheckCircle className="me-1" />
                        Hoàn thành
                    </Badge>
                );
            case 'PENDING':
                return (
                    <Badge bg="warning" text="dark" pill>
                        <FaHourglassHalf className="me-1" />
                        Đang xử lý
                    </Badge>
                );
            case 'CANCELLED':
                return (
                    <Badge bg="danger" pill>
                        <FaTimesCircle className="me-1" />
                        Đã hủy
                    </Badge>
                );
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const items = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(0, endPage - maxPagesToShow + 1);
        }

        if (currentPage > 0) {
            items.push(
                <Pagination.First key="first" onClick={() => handlePageChange(0)} />
            );
            items.push(
                <Pagination.Prev
                    key="prev"
                    onClick={() => handlePageChange(currentPage - 1)}
                />
            );
        }

        for (let page = startPage; page <= endPage; page++) {
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
            items.push(
                <Pagination.Next
                    key="next"
                    onClick={() => handlePageChange(currentPage + 1)}
                />
            );
            items.push(
                <Pagination.Last
                    key="last"
                    onClick={() => handlePageChange(totalPages - 1)}
                />
            );
        }

        return (
            <Pagination className="custom-pagination justify-content-center mt-4">
                {items}
            </Pagination>
        );
    };

    return (
        <div className="my-reward-transactions-page">
            <Container fluid className="py-4">
                <Row className="mb-4">
                    <Col>
                        <Button
                            size="sm"
                            onClick={() => navigate(-1)}
                            className="mb-3 btn-outline-gradient"
                        >
                            <FaArrowLeft className="me-2" />
                            Quay lại
                        </Button>
                        <h2 className="fw-bold mb-1 text-gradient">
                            Lịch Sử Đổi Thưởng
                        </h2>
                        <p className="text-muted mb-0">
                            Xem lại các giao dịch đổi quà tặng của bạn.
                        </p>
                    </Col>
                    <Col xs="auto" className="d-flex align-items-center">
                        <div className="stats-box">
                            <div className="text-secondary small mb-1">Tổng giao dịch</div>
                            <div className="fw-bold fs-4 text-light">{totalElements}</div>
                        </div>
                    </Col>
                </Row>

                {alert && (
                    <Alert
                        variant={alert.type}
                        onClose={() => setAlert(null)}
                        dismissible
                        className="mb-3"
                    >
                        {alert.text}
                    </Alert>
                )}

                <Card className="bg-dark text-light border-0 shadow-sm transactions-card">
                    <Card.Body>
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="light" />
                                <div className="mt-3 text-secondary">Đang tải dữ liệu...</div>
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive">
                                    <Table hover className="align-middle transactions-table mb-0">
                                        <thead>
                                            <tr>
                                                <th className="bg-dark text-light">ID</th>
                                                <th className="bg-dark text-light">Quà tặng</th>
                                                <th className="bg-dark text-light">Hình ảnh</th>
                                                <th className="bg-dark text-light">Giá xu</th>
                                                <th className="bg-dark text-light">Người nhận</th>
                                                <th className="bg-dark text-light">Thời gian</th>
                                                <th className="bg-dark text-light">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="text-center py-4 bg-dark text-light">
                                                        <FaBoxOpen size={40} className="text-muted mb-2" />
                                                        <div className="text-secondary">
                                                            Bạn chưa có giao dịch nào
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                transactions.map((transaction) => (
                                                    <tr key={transaction.id}>
                                                        <td className="bg-dark text-light">
                                                            #{transaction.id}
                                                        </td>
                                                        <td className="bg-dark text-light">
                                                            <div className="fw-semibold">
                                                                {transaction.reward?.name || 'N/A'}
                                                            </div>
                                                        </td>
                                                        <td className="bg-dark text-light">
                                                            {transaction.reward?.imageUrl ? (
                                                                <img
                                                                    src={
                                                                        backendBaseURL +
                                                                        transaction.reward?.imageUrl
                                                                    }
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
                                                                {(() => {
                                                                    const info = parseDeliveryInfo(transaction.deliveryInfo);
                                                                    return (
                                                                        <>
                                                                            <div className="mb-1">
                                                                                <FaUser className="me-1 text-muted" />
                                                                                {info.name}
                                                                            </div>
                                                                            <div className="mb-1">
                                                                                <FaPhone className="me-1 text-muted" />
                                                                                {info.phone}
                                                                            </div>
                                                                            <div className="text-muted" style={{ maxWidth: 200 }}>
                                                                                <FaMapMarkerAlt className="me-1" />
                                                                                {info.address}
                                                                            </div>
                                                                        </>
                                                                    );
                                                                })()}
                                                            </div>
                                                        </td>
                                                        <td className="bg-dark text-light">
                                                            <div className="d-flex align-items-center text-muted">
                                                                <FaCalendar className="me-2" />
                                                                <small>{transaction.redeemedAt}</small>
                                                            </div>
                                                        </td>
                                                        <td className="bg-dark text-light">
                                                            {getStatusBadge(transaction.status)}
                                                        </td>
                                                    </tr>
                                                ))
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

export default MyRewardTransactions;
