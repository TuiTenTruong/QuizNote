import React from 'react';
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
import styles from './scss/AdminRewardTransactionsSection.module.scss';
import type { IRewardTransaction, RewardTransactionStatus } from '../../types/reward';
import type { RewardTransactionFilterStatus } from '../../hooks/useRewardTransaction';
import {
    formatRewardTransactionDate,
    parseRewardDeliveryInfo,
    useRewardTransactionDetailActions,
    useRewardTransactionFilter,
    useRewardTransactionQuery
} from '../../hooks/useRewardTransaction';

interface DeliveryInfo {
    name: string;
    phone: string;
    address: string;
}

const getStatusBadge = (status: RewardTransactionStatus) => {
    if (status === 'COMPLETED') {
        return <Badge bg="success" pill><FaCheckCircle className="me-1" />Hoan thanh</Badge>;
    }

    if (status === 'PENDING') {
        return <Badge bg="warning" text="dark" pill><FaHourglassHalf className="me-1" />Dang xu ly</Badge>;
    }

    if (status === 'CANCELLED') {
        return <Badge bg="danger" pill><FaTimesCircle className="me-1" />Da huy</Badge>;
    }

    return <Badge bg="secondary">{status}</Badge>;
};

const AdminRewardTransactionsSection = () => {
    const navigate = useNavigate();
    const query = useRewardTransactionQuery();
    const filter = useRewardTransactionFilter(query.transactions);
    const detail = useRewardTransactionDetailActions(query.fetchTransactions);

    const filteredTransactions = filter.filteredTransactions;
    const searchTerm = filter.searchTerm;
    const setSearchTerm = filter.setSearchTerm;
    const filterStatus = filter.filterStatus;
    const setFilterStatus = filter.setFilterStatus;

    const loading = query.loading;
    const currentPage = query.currentPage;
    const totalPages = query.totalPages;
    const totalElements = query.totalElements;
    const backendBaseURL = query.backendBaseURL;
    const handlePageChange = query.handlePageChange;

    const showDetailModal = detail.showDetailModal;
    const selectedTransaction = detail.selectedTransaction;
    const updatingStatus = detail.updatingStatus;
    const handleShowDetail = detail.handleShowDetail;
    const handleCloseDetail = detail.handleCloseDetail;
    const handleUpdateStatus = detail.handleUpdateStatus;

    const parseDeliveryInfo = parseRewardDeliveryInfo;
    const formatDate = formatRewardTransactionDate;

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
                <Pagination.Item key={page} active={page === currentPage} onClick={() => handlePageChange(page)}>
                    {page + 1}
                </Pagination.Item>
            );
        }

        if (currentPage < totalPages - 1) {
            items.push(<Pagination.Next key="next" onClick={() => handlePageChange(currentPage + 1)} />);
            items.push(<Pagination.Last key="last" onClick={() => handlePageChange(totalPages - 1)} />);
        }

        return <Pagination className={`${styles.customPagination} justify-content-center mt-4`}>{items}</Pagination>;
    };

    return (
        <div className={styles.adminRewardTransactionsPage}>
            <Container fluid>
                <Row className="mb-4">
                    <Col>
                        <Button size="sm" onClick={() => navigate(-1)} className={`mb-3 ${styles.btnOutlineGradient}`}>
                            <FaArrowLeft className="me-2" />
                            Quay lai
                        </Button>
                        <h2 className={`fw-bold mb-1 ${styles.textGradient}`}>Quan ly Giao dich Qua Tang</h2>
                        <p className={`${styles.mutedText} mb-0`}>Theo doi va quan ly cac giao dich doi qua tang cua nguoi dung.</p>
                    </Col>
                    <Col xs="auto" className="d-flex align-items-center">
                        <div className={styles.statsBox}>
                            <div className="text-secondary small mb-1">Tong giao dich</div>
                            <div className="fw-bold fs-4 text-light">{totalElements}</div>
                        </div>
                    </Col>
                </Row>

                <Card className={`bg-dark text-light border-0 shadow-sm ${styles.transactionsTableCard}`}>
                    <Card.Body>
                        <Row className="mb-3 g-3">
                            <Col md={6}>
                                <InputGroup className={styles.searchGroup}>
                                    <InputGroup.Text className={styles.bgInput}><FaSearch /></InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tim kiem theo ten, email nguoi dung hoac ten qua..."
                                        value={searchTerm}
                                        onChange={(event) => setSearchTerm(event.target.value)}
                                        className={styles.bgInput}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={3}>
                                <Form.Select
                                    value={filterStatus}
                                    onChange={(event) => setFilterStatus(event.target.value as RewardTransactionFilterStatus)}
                                    className={styles.bgInput}
                                >
                                    <option value="All">Tat ca trang thai</option>
                                    <option value="COMPLETED">Hoan thanh</option>
                                    <option value="PENDING">Dang xu ly</option>
                                    <option value="CANCELLED">Da huy</option>
                                </Form.Select>
                            </Col>
                            <Col md={3} className="text-md-end text-secondary d-flex align-items-center justify-content-md-end">
                                Hien thi: <span className="fw-semibold ms-1">{filteredTransactions.length}</span> / {totalElements}
                            </Col>
                        </Row>

                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="light" />
                                <div className="mt-3 text-secondary">Dang tai du lieu...</div>
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive">
                                    <Table hover className={`align-middle mb-0 ${styles.transactionsTable}`}>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Nguoi dung</th>
                                                <th>Qua tang</th>
                                                <th>Hinh anh</th>
                                                <th>Gia xu</th>
                                                <th>Thoi gian</th>
                                                <th>Trang thai</th>
                                                <th className="text-center">Thao tac</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredTransactions.length === 0 ? (
                                                <tr>
                                                    <td colSpan={8} className="text-center py-4 text-light">
                                                        <FaBoxOpen size={40} className="text-muted mb-2" />
                                                        <div className="text-secondary">Khong tim thay giao dich nao</div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredTransactions.map((transaction) => {
                                                    const userName = transaction.user?.name || transaction.userName || 'N/A';
                                                    const userEmail = transaction.user?.email || transaction.userEmail || 'N/A';
                                                    const date = transaction.redeemedAt || transaction.createdAt;

                                                    return (
                                                        <tr key={transaction.id}>
                                                            <td className="text-light">#{transaction.id}</td>
                                                            <td className="text-light">
                                                                <div className="d-flex align-items-center">
                                                                    <div className={`${styles.userIconBox} me-2`}><FaUser /></div>
                                                                    <div>
                                                                        <div className="fw-semibold text-light">{userName}</div>
                                                                        <small className={styles.mutedText}>{userEmail}</small>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="text-light"><div className="fw-semibold text-light">{transaction.reward?.name || 'N/A'}</div></td>
                                                            <td className="text-light">
                                                                {transaction.reward?.imageUrl ? (
                                                                    <img src={`${backendBaseURL}${transaction.reward.imageUrl}`} alt={transaction.reward?.name} className={styles.transactionThumb} />
                                                                ) : (
                                                                    <div className={`${styles.transactionThumb} ${styles.placeholder}`}><FaGift className="text-muted" /></div>
                                                                )}
                                                            </td>
                                                            <td className="text-light">
                                                                <Badge bg="warning" text="dark" className="px-3 py-2 fs-6">
                                                                    <FaCoins className="me-1" />
                                                                    {transaction.coinsCost || transaction.reward?.cost || 0}
                                                                </Badge>
                                                            </td>
                                                            <td className="text-light">
                                                                <div className={`d-flex align-items-center ${styles.mutedText}`}>
                                                                    <FaCalendar className="me-2" />
                                                                    <small>{formatDate(date)}</small>
                                                                </div>
                                                            </td>
                                                            <td className="text-light">{getStatusBadge(transaction.status)}</td>
                                                            <td className="text-light text-center">
                                                                <Button variant="outline-info" size="sm" onClick={() => handleShowDetail(transaction)}><FaEye /></Button>
                                                            </td>
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

            <Modal show={showDetailModal} onHide={handleCloseDetail} size="lg" centered className={styles.transactionDetailModal}>
                <Modal.Header closeButton className="bg-dark text-light border-0">
                    <Modal.Title>Chi tiet giao dich #{selectedTransaction?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-light">
                    {selectedTransaction && (
                        <Row className="g-4">
                            <Col md={6}>
                                <Card className="bg-dark border-secondary">
                                    <Card.Body>
                                        <h6 className="text-warning mb-3">Thong tin qua tang</h6>
                                        <div className="text-center mb-3">
                                            {selectedTransaction.reward?.imageUrl ? (
                                                <img src={`${backendBaseURL}${selectedTransaction.reward.imageUrl}`} alt={selectedTransaction.reward?.name} style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '12px' }} />
                                            ) : (
                                                <div style={{ width: '150px', height: '150px' }} className="bg-secondary rounded d-flex align-items-center justify-content-center mx-auto">
                                                    <FaGift size={50} className="text-muted" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="mb-2 text-light"><strong>Ten qua:</strong> {selectedTransaction.reward?.name || 'N/A'}</div>
                                        <div className="mb-2 text-light"><strong>Gia xu:</strong> <Badge bg="warning" text="dark"><FaCoins className="me-1" />{selectedTransaction.coinsCost || selectedTransaction.reward?.cost || 0}</Badge></div>
                                        <div className="mb-2 text-light"><strong>Thoi gian:</strong> <span className="text-light">{formatDate(selectedTransaction.redeemedAt || selectedTransaction.createdAt)}</span></div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="bg-dark border-secondary">
                                    <Card.Body>
                                        <h6 className="text-warning mb-3">Thong tin nguoi nhan</h6>
                                        <div className="mb-3">
                                            <div className="mb-2 text-light"><FaUser className="me-2 text-muted" /><strong>Nguoi dung:</strong> {selectedTransaction.user?.name || selectedTransaction.userName || 'N/A'}</div>
                                            <div className={`mb-2 small ms-4 ${styles.mutedText}`}>{selectedTransaction.user?.email || selectedTransaction.userEmail || 'N/A'}</div>
                                        </div>
                                        {(() => {
                                            const info = parseDeliveryInfo(selectedTransaction.deliveryInfo);
                                            return (
                                                <>
                                                    <div className="mb-2 text-light"><FaUser className="me-2 text-muted" /><strong>Ten nguoi nhan:</strong><br /><span className="ms-4">{info.name}</span></div>
                                                    <div className="mb-2 text-light"><FaPhone className="me-2 text-muted" /><strong>So dien thoai:</strong><br /><span className="ms-4">{info.phone}</span></div>
                                                    <div className="mb-3 text-light"><FaMapMarkerAlt className="me-2 text-muted" /><strong>Dia chi:</strong><br /><span className="ms-4">{info.address}</span></div>
                                                </>
                                            );
                                        })()}
                                        <div className="mb-3 text-light"><strong>Trang thai hien tai:</strong><br /><div className="mt-2">{getStatusBadge(selectedTransaction.status)}</div></div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={12}>
                                <Card className="bg-dark border-secondary">
                                    <Card.Body>
                                        <h6 className="text-warning mb-3"><FaEdit className="me-2" />Cap nhat trang thai</h6>
                                        <div className="d-flex gap-2 flex-wrap">
                                            <Button variant="warning" size="sm" onClick={() => void handleUpdateStatus('PENDING')} disabled={updatingStatus || selectedTransaction.status === 'PENDING'}><FaHourglassHalf className="me-1" />Dang xu ly</Button>
                                            <Button variant="success" size="sm" onClick={() => void handleUpdateStatus('COMPLETED')} disabled={updatingStatus || selectedTransaction.status === 'COMPLETED'}><FaCheckCircle className="me-1" />Hoan thanh</Button>
                                            <Button variant="danger" size="sm" onClick={() => void handleUpdateStatus('CANCELLED')} disabled={updatingStatus || selectedTransaction.status === 'CANCELLED'}><FaTimesCircle className="me-1" />Huy bo</Button>
                                        </div>
                                        {updatingStatus && <div className="mt-2 text-info"><Spinner animation="border" size="sm" className="me-2" />Dang cap nhat...</div>}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-dark border-0"><Button variant="outline-secondary" onClick={handleCloseDetail}>Dong</Button></Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminRewardTransactionsSection;
