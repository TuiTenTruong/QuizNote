import React, { useEffect, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Table,
    Button,
    Form,
    InputGroup,
    Badge,
    Spinner,
    Alert,
    Pagination,
    Modal
} from 'react-bootstrap';
import {
    FaSearch,
    FaGift,
    FaCoins,
    FaUser,
    FaCalendar,
    FaCheckCircle,
    FaHourglassHalf,
    FaTimesCircle,
    FaBoxOpen,
    FaArrowLeft,
    FaEye,
    FaPhone,
    FaMapMarkerAlt,
    FaEdit
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AdminRewardTransactionsPage.scss';
import { getAllRewardTransactions, updateTransactionStatus } from '../../services/apiService';
import axiosInstance from '../../utils/axiosCustomize';

const AdminRewardTransactionsPage = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
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
            const response = await getAllRewardTransactions(currentPage, pageSize);
            if (response && response.data) {
                setTransactions(response.data.result || []);
                setTotalPages(response.data.meta.pages || 0);
                setTotalElements(response.data.meta.total || 0);
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

    const filteredTransactions = transactions.filter((transaction) => {
        const matchSearch =
            transaction.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.reward?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus =
            filterStatus === 'All' ||
            (filterStatus === 'COMPLETED' && transaction.status === 'COMPLETED') ||
            (filterStatus === 'PENDING' && transaction.status === 'PENDING') ||
            (filterStatus === 'CANCELLED' && transaction.status === 'CANCELLED');
        console.log('Match Search:', matchSearch, 'Match Status:', matchStatus);
        return matchSearch && matchStatus;
    });
    console.log('All Transactions:', transactions);
    console.log('Filtered Transactions:', filteredTransactions);
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

    const handleShowDetail = (transaction) => {
        setSelectedTransaction(transaction);
        setShowDetailModal(true);
    };

    const handleCloseDetail = () => {
        setShowDetailModal(false);
        setSelectedTransaction(null);
    };

    const handleUpdateStatus = async (newStatus) => {
        if (!selectedTransaction) return;

        setUpdatingStatus(true);
        try {
            const response = await updateTransactionStatus(selectedTransaction.id, newStatus);
            if (response) {
                showAlert('success', 'Cập nhật trạng thái thành công!');
                await fetchTransactions();
                handleCloseDetail();
            }
        } catch (error) {
            console.error('Error updating status:', error);
            const errorMsg = error.response?.data?.message || 'Không thể cập nhật trạng thái.';
            showAlert('danger', errorMsg);
        } finally {
            setUpdatingStatus(false);
        }
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
        <div className="admin-reward-transactions-page">
            <Container fluid >
                {/* Header */}
                <Row className="mb-4">
                    <Col>
                        <Button

                            size="sm"
                            onClick={() => navigate(-1)}
                            className="mb-3 btn-outline-gradient "
                        >
                            <FaArrowLeft className="me-2" />
                            Quay lại
                        </Button>
                        <h2 className="fw-bold mb-1 text-gradient">
                            Quản lý Giao dịch Quà Tặng
                        </h2>
                        <p className="text-muted mb-0">
                            Theo dõi và quản lý các giao dịch đổi quà tặng của người dùng.
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

                <Card className="bg-dark text-light border-0 shadow-sm transactions-table-card">
                    <Card.Body>
                        {/* Filters */}
                        <Row className="mb-3 g-3">
                            <Col md={6}>
                                <InputGroup className="search-group">
                                    <InputGroup.Text className="bg-input border-0 text-secondary">
                                        <FaSearch />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tìm kiếm theo tên, email người dùng hoặc tên quà..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-input border-0 text-light"
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={3}>
                                <Form.Select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="bg-input border-0 text-light"
                                >
                                    <option value="All">Tất cả trạng thái</option>
                                    <option value="COMPLETED">Hoàn thành</option>
                                    <option value="PENDING">Đang xử lý</option>
                                    <option value="CANCELLED">Đã hủy</option>
                                </Form.Select>
                            </Col>
                            <Col
                                md={3}
                                className="text-md-end text-secondary d-flex align-items-center justify-content-md-end"
                            >
                                Hiển thị:{' '}
                                <span className="fw-semibold ms-1">
                                    {filteredTransactions.length}
                                </span>{' '}
                                / {totalElements}
                            </Col>
                        </Row>

                        {/* Table / Loading */}
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="light" />
                                <div className="mt-3 text-secondary">Đang tải dữ liệu...</div>
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive">
                                    <Table
                                        hover
                                        className="align-middle transactions-table mb-0"
                                    >
                                        <thead>
                                            <tr >
                                                <th className="bg-dark text-light">ID</th>
                                                <th className="bg-dark text-light">Người dùng</th>
                                                <th className="bg-dark text-light">Quà tặng</th>
                                                <th className="bg-dark text-light">Hình ảnh</th>
                                                <th className="bg-dark text-light">Giá xu</th>
                                                <th className="bg-dark text-light">Thời gian</th>
                                                <th className="bg-dark text-light">Trạng thái</th>
                                                <th className="bg-dark text-light text-center">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredTransactions.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className="text-center py-4 bg-dark text-light">
                                                        <FaBoxOpen
                                                            size={40}
                                                            className="text-muted mb-2"
                                                        />
                                                        <div className="text-secondary">
                                                            Không tìm thấy giao dịch nào
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredTransactions.map((transaction) => (
                                                    <tr key={transaction.id}>
                                                        <td className="bg-dark text-light">
                                                            #{transaction.id}
                                                        </td>
                                                        <td className="bg-dark text-light">
                                                            <div className="d-flex align-items-center">
                                                                <div className="user-icon-box me-2">
                                                                    <FaUser />
                                                                </div>
                                                                <div>
                                                                    <div className="fw-semibold bg-dark text-light">
                                                                        {transaction.user?.name || 'N/A'}
                                                                    </div>
                                                                    <small className="text-muted">
                                                                        {transaction.user?.email || 'N/A'}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="bg-dark text-light">
                                                            <div className="fw-semibold bg-dark text-light">
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
                                                            <Badge
                                                                bg="warning"
                                                                text="dark"
                                                                className="px-3 py-2 fs-6"
                                                            >
                                                                <FaCoins className="me-1" />
                                                                {transaction.coinsCost || 0}
                                                            </Badge>
                                                        </td>
                                                        <td className="bg-dark text-light">
                                                            <div className="d-flex align-items-center text-muted">
                                                                <FaCalendar className="me-2" />
                                                                <small>
                                                                    {transaction.redeemedAt}
                                                                </small>
                                                            </div>
                                                        </td>
                                                        <td className="bg-dark text-light">{getStatusBadge(transaction.status)}</td>
                                                        <td className="bg-dark text-light text-center">
                                                            <Button
                                                                variant="outline-info"
                                                                size="sm"
                                                                onClick={() => handleShowDetail(transaction)}
                                                            >
                                                                <FaEye />
                                                            </Button>
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

            {/* Detail Modal */}
            <Modal
                show={showDetailModal}
                onHide={handleCloseDetail}
                size="lg"
                centered
                className="transaction-detail-modal"
            >
                <Modal.Header closeButton className="bg-dark text-light border-0">
                    <Modal.Title>
                        Chi tiết giao dịch #{selectedTransaction?.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-light">
                    {selectedTransaction && (
                        <Row className="g-4">
                            <Col md={6}>
                                <Card className="bg-dark border-secondary">
                                    <Card.Body>
                                        <h6 className="text-warning mb-3">Thông tin quà tặng</h6>
                                        <div className="text-center mb-3">
                                            {selectedTransaction.reward?.imageUrl ? (
                                                <img
                                                    src={backendBaseURL + selectedTransaction.reward?.imageUrl}
                                                    alt={selectedTransaction.reward?.name}
                                                    style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '12px' }}
                                                />
                                            ) : (
                                                <div style={{ width: '150px', height: '150px' }} className="bg-secondary rounded d-flex align-items-center justify-content-center mx-auto">
                                                    <FaGift size={50} className="text-muted" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="mb-2 text-light">
                                            <strong>Tên quà:</strong> {selectedTransaction.reward?.name || 'N/A'}
                                        </div>
                                        <div className="mb-2 text-light">
                                            <strong>Giá xu:</strong>{' '}
                                            <Badge bg="warning" text="dark">
                                                <FaCoins className="me-1" />
                                                {selectedTransaction.coinsCost || 0}
                                            </Badge>
                                        </div>
                                        <div className="mb-2 text-light">
                                            <strong>Thời gian:</strong>{' '}
                                            <span className="text-light">{selectedTransaction.redeemedAt}</span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="bg-dark border-secondary">
                                    <Card.Body>
                                        <h6 className="text-warning mb-3">Thông tin người nhận</h6>
                                        <div className="mb-3">
                                            <div className="mb-2 text-light">
                                                <FaUser className="me-2 text-muted" />
                                                <strong>Người dùng:</strong> {selectedTransaction.user?.name || 'N/A'}
                                            </div>
                                            <div className="mb-2 text-light small ms-4">
                                                {selectedTransaction.user?.email || 'N/A'}
                                            </div>
                                        </div>
                                        {(() => {
                                            const info = parseDeliveryInfo(selectedTransaction.deliveryInfo);
                                            return (
                                                <>
                                                    <div className="mb-2 text-light">
                                                        <FaUser className="me-2 text-muted" />
                                                        <strong>Tên người nhận:</strong><br />
                                                        <span className="ms-4">{info.name}</span>
                                                    </div>
                                                    <div className="mb-2 text-light">
                                                        <FaPhone className="me-2 text-muted" />
                                                        <strong>Số điện thoại:</strong><br />
                                                        <span className="ms-4">{info.phone}</span>
                                                    </div>
                                                    <div className="mb-3  text-light">
                                                        <FaMapMarkerAlt className="me-2 text-muted" />
                                                        <strong>Địa chỉ:</strong><br />
                                                        <span className="ms-4">{info.address}</span>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                        <div className="mb-3  text-light">
                                            <strong>Trạng thái hiện tại:</strong><br />
                                            <div className="mt-2">
                                                {getStatusBadge(selectedTransaction.status)}
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={12}>
                                <Card className="bg-dark border-secondary">
                                    <Card.Body>
                                        <h6 className="text-warning mb-3">
                                            <FaEdit className="me-2" />
                                            Cập nhật trạng thái
                                        </h6>
                                        <div className="d-flex gap-2 flex-wrap">
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                onClick={() => handleUpdateStatus('PENDING')}
                                                disabled={updatingStatus || selectedTransaction.status === 'PENDING'}
                                            >
                                                <FaHourglassHalf className="me-1" />
                                                Đang xử lý
                                            </Button>
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handleUpdateStatus('COMPLETED')}
                                                disabled={updatingStatus || selectedTransaction.status === 'COMPLETED'}
                                            >
                                                <FaCheckCircle className="me-1" />
                                                Hoàn thành
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleUpdateStatus('CANCELLED')}
                                                disabled={updatingStatus || selectedTransaction.status === 'CANCELLED'}
                                            >
                                                <FaTimesCircle className="me-1" />
                                                Hủy bỏ
                                            </Button>
                                        </div>
                                        {updatingStatus && (
                                            <div className="mt-2 text-info">
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Đang cập nhật...
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-dark border-0">
                    <Button variant="outline-secondary" onClick={handleCloseDetail}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminRewardTransactionsPage;
