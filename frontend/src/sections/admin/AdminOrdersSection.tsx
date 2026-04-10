import React from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    InputGroup,
    Table,
    Badge,
    Modal
} from 'react-bootstrap';
import { FaSearch, FaEye, FaDownload, FaFilter } from 'react-icons/fa';
import {
    useOrderDetailFeature,
    useOrderFilter,
    useOrderFormatters,
    useOrderQuery
} from '../../hooks/useOrder';
import styles from './scss/AdminOrdersSection.module.scss';
import type {
    AdminOrderFilterStatus
} from '../../types/order';

const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string }> = {
        PENDING: { bg: 'warning', text: 'Cho thanh toan' },
        SUCCESS: { bg: 'success', text: 'Thanh cong' },
        FAILED: { bg: 'danger', text: 'That bai' },
        CANCELLED: { bg: 'secondary', text: 'Da huy' }
    };

    const item = config[status] || { bg: 'secondary', text: status };
    return <Badge bg={item.bg}>{item.text}</Badge>;
};

const AdminOrdersSection = () => {
    const { orders, loading, error, stats } = useOrderQuery();
    const { searchTerm, setSearchTerm, filterStatus, setFilterStatus, filteredOrders } = useOrderFilter(orders);
    const { showDetailModal, selectedOrder, handleViewDetails, closeDetailModal } = useOrderDetailFeature();
    const { formatPaymentTime, calculateSellerReceive } = useOrderFormatters();

    return (
        <div className={styles.adminOrdersPage}>
            <Container fluid>
                <Row className="mb-4">
                    <Col>
                        <h2 className={`${styles.textGradient} fw-bold mb-2`}>Quan Ly Don Hang</h2>
                        <p className={styles.mutedText}>Theo doi va quan ly tat ca giao dich mua tai lieu hoc tap</p>
                    </Col>
                </Row>

                <Row className="g-3 mb-4">
                    <Col md={3}>
                        <Card className={`${styles.statCard} bg-dark border-0`}>
                            <Card.Body className="text-center">
                                <h3 className="text-primary fw-bold mb-1">{stats.totalOrders}</h3>
                                <p className={`${styles.mutedText} mb-0`}>Tong don hang</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className={`${styles.statCard} bg-dark border-0`}>
                            <Card.Body className="text-center">
                                <h3 className="text-success fw-bold mb-1">{stats.successfulOrders}</h3>
                                <p className={`${styles.mutedText} mb-0`}>Da hoan thanh</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className={`${styles.statCard} bg-dark border-0`}>
                            <Card.Body className="text-center">
                                <h3 className="text-info fw-bold mb-1">{stats.totalRevenue.toLocaleString('vi-VN')} VND</h3>
                                <p className={`${styles.mutedText} mb-0`}>Doanh thu</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className={`${styles.statCard} bg-dark border-0`}>
                            <Card.Body className="text-center">
                                <h3 className="text-warning fw-bold mb-1">{stats.platformFee.toLocaleString('vi-VN')} VND</h3>
                                <p className="text-white mb-0">Phi nen tang (15%)</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col md={6}>
                        <InputGroup className={styles.searchInput}>
                            <InputGroup.Text className="bg-dark text-light border-secondary">
                                <FaSearch />
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Tim kiem theo ma giao dich, ten nguoi mua, mon hoc..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-dark text-light border-secondary"
                            />
                        </InputGroup>
                    </Col>
                    <Col md={3}>
                        <InputGroup className={styles.searchInput}>
                            <InputGroup.Text className="bg-dark text-light border-secondary">
                                <FaFilter />
                            </InputGroup.Text>
                            <Form.Select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-dark text-light border-secondary"
                            >
                                <option value="All">Tat ca trang thai</option>
                                <option value="PENDING">Cho thanh toan</option>
                                <option value="SUCCESS">Thanh cong</option>
                                <option value="FAILED">That bai</option>
                                <option value="CANCELLED">Da huy</option>
                            </Form.Select>
                        </InputGroup>
                    </Col>
                    <Col md={3} className="text-end">
                        <Button variant="outline-light" className={styles.btnExport}>
                            <FaDownload className="me-2" />
                            Xuat bao cao
                        </Button>
                    </Col>
                </Row>

                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Dang tai...</span>
                        </div>
                        <p className="text-light mt-2">Dang tai du lieu don hang...</p>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <Card className={`${styles.tableCard} bg-dark border-0`}>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table hover className={`${styles.ordersTable} mb-0`}>
                                    <thead>
                                        <tr>
                                            <th>Ma giao dich</th>
                                            <th>Khach hang</th>
                                            <th>Mon hoc</th>
                                            <th>Seller</th>
                                            <th>So tien</th>
                                            <th>Phi PT</th>
                                            <th>Seller nhan</th>
                                            <th>Trang thai</th>
                                            <th>Ngay tao</th>
                                            <th>Thao tac</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="fw-semibold text-light">#{order.transactionNo ?? 'N/A'}</td>
                                                <td>
                                                    <div className="fw-semibold text-light">{order.buyer?.name ?? 'N/A'}</div>
                                                    <small className="text-muted">{order.buyer?.email ?? 'N/A'}</small>
                                                </td>
                                                <td className="text-light">{order.subject?.name ?? 'N/A'}</td>
                                                <td className="text-light">{order.seller?.name ?? 'N/A'}</td>
                                                <td className="text-success fw-semibold">{(order.amount ?? 0).toLocaleString('vi-VN')} VND</td>
                                                <td className="text-warning">{((order.amount ?? 0) * 0.15).toLocaleString('vi-VN')} VND</td>
                                                <td className="text-info">{calculateSellerReceive(order.amount ?? 0).toLocaleString('vi-VN')} VND</td>
                                                <td>{getStatusBadge(order.status)}</td>
                                                <td className="text-light">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                                <td>
                                                    <Button variant="outline-light" size="sm" onClick={() => handleViewDetails(order)}>
                                                        <FaEye />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>

                            {filteredOrders.length === 0 && <p className="text-center text-secondary py-4">Khong tim thay don hang nao.</p>}
                        </Card.Body>
                    </Card>
                )}

                <Modal
                    show={showDetailModal}
                    onHide={closeDetailModal}
                    size="lg"
                    centered
                    dialogClassName={styles.orderDetailModal}
                >
                    <Modal.Header closeButton className="bg-dark text-white border-secondary">
                        <Modal.Title>Chi Tiet Don Hang</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-dark text-white">
                        {selectedOrder && (
                            <Row>
                                <Col md={6}>
                                    <h6 className="text-light mb-3">Thong Tin Don Hang</h6>
                                    <div className="mb-2"><strong>Ma giao dich:</strong> #{selectedOrder.transactionNo ?? 'N/A'}</div>
                                    <div className="mb-2"><strong>Khach hang:</strong> {selectedOrder.buyer?.name ?? 'N/A'}</div>
                                    <div className="mb-2"><strong>Email:</strong> {selectedOrder.buyer?.email ?? 'N/A'}</div>
                                    <div className="mb-2"><strong>Mon hoc:</strong> {selectedOrder.subject?.name ?? 'N/A'}</div>
                                    <div className="mb-2"><strong>Seller:</strong> {selectedOrder.seller?.name ?? 'N/A'}</div>
                                </Col>
                                <Col md={6}>
                                    <h6 className="text-light mb-3">Thong Tin Thanh Toan</h6>
                                    <div className="mb-2">
                                        <strong>Tong tien:</strong> <span className="text-success">{(selectedOrder.amount ?? 0).toLocaleString('vi-VN')} VND</span>
                                    </div>
                                    <div className="mb-2">
                                        <strong>Phi nen tang (15%):</strong> <span className="text-warning">{((selectedOrder.amount ?? 0) * 0.15).toLocaleString('vi-VN')} VND</span>
                                    </div>
                                    <div className="mb-2">
                                        <strong>Seller nhan:</strong> <span className="text-info">{calculateSellerReceive(selectedOrder.amount ?? 0).toLocaleString('vi-VN')} VND</span>
                                    </div>
                                    <div className="mb-2"><strong>Phuong thuc:</strong> {selectedOrder.paymentMethod ?? 'N/A'}</div>
                                    <div className="mb-2"><strong>Trang thai:</strong> {getStatusBadge(selectedOrder.status)}</div>
                                    <div className="mb-2">
                                        <strong>Thoi gian thanh toan:</strong> {formatPaymentTime(selectedOrder.paymentTime)}
                                    </div>
                                    <div className="mb-2"><strong>Ngay tao:</strong> {selectedOrder.createdAt}</div>
                                </Col>
                            </Row>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="bg-dark border-secondary">
                        <Button variant="secondary" onClick={closeDetailModal}>
                            Dong
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default AdminOrdersSection;
