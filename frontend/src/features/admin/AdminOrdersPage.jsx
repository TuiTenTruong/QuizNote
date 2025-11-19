import React, { useState, useEffect } from "react";
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
} from "react-bootstrap";
import {
    FaSearch,
    FaEye,
    FaDownload,
    FaFilter
} from "react-icons/fa";
import "./AdminOrdersPage.scss";
import { getAllAdminOrders } from "../../services/apiService";

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalOrders: 0,
        successfulOrders: 0,
        totalRevenue: 0,
        platformFee: 0
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getAllAdminOrders();

                if (response && response.data) {
                    setOrders(response.data.orders || []);
                    setStats({
                        totalOrders: response.data.totalOrders || 0,
                        successfulOrders: response.data.successfulOrders || 0,
                        totalRevenue: response.data.totalRevenue || 0,
                        platformFee: response.data.platformFee || 0
                    });
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError("Không thể tải dữ liệu đơn hàng. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchSearch =
            order.transactionNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.subject?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchStatus = filterStatus === 'All' || order.status === filterStatus;

        return matchSearch && matchStatus;
    });

    const getStatusBadge = (status) => {
        const config = {
            'PENDING': { bg: 'warning', text: 'Chờ thanh toán' },
            'SUCCESS': { bg: 'success', text: 'Thành công' },
            'FAILED': { bg: 'danger', text: 'Thất bại' },
            'CANCELLED': { bg: 'secondary', text: 'Đã hủy' }
        };
        const item = config[status] || { bg: 'secondary', text: status };
        return <Badge bg={item.bg}>{item.text}</Badge>;
    };

    const formatPaymentTime = (timeStr) => {
        if (!timeStr || timeStr.length !== 14) return timeStr;
        const year = timeStr.substring(0, 4);
        const month = timeStr.substring(4, 6);
        const day = timeStr.substring(6, 8);
        const hour = timeStr.substring(8, 10);
        const minute = timeStr.substring(10, 12);
        const second = timeStr.substring(12, 14);
        return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    };

    const calculateSellerReceive = (amount) => {
        return amount * 0.85; // Seller receives 85% (platform takes 15%)
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    return (
        <div className="admin-orders-page">
            <Container fluid>
                {/* Header */}
                <Row className="mb-4">
                    <Col>
                        <h2 className="text-gradient fw-bold mb-2">Quản Lý Đơn Hàng</h2>
                        <p className="text-muted">
                            Theo dõi và quản lý tất cả giao dịch mua tài liệu học tập
                        </p>
                    </Col>
                </Row>

                {/* Stats Cards */}
                <Row className="g-3 mb-4">
                    <Col md={3}>
                        <Card className="stat-card bg-dark border-0">
                            <Card.Body className="text-center">
                                <h3 className="text-primary fw-bold mb-1">{stats.totalOrders}</h3>
                                <p className="text-muted mb-0">Tổng đơn hàng</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="stat-card bg-dark border-0">
                            <Card.Body className="text-center">
                                <h3 className="text-success fw-bold mb-1">{stats.successfulOrders}</h3>
                                <p className="text-muted mb-0">Đã hoàn thành</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="stat-card bg-dark border-0">
                            <Card.Body className="text-center">
                                <h3 className="text-info fw-bold mb-1">
                                    {stats.totalRevenue.toLocaleString('vi-VN')}₫
                                </h3>
                                <p className="text-muted mb-0">Doanh thu</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="stat-card bg-dark border-0">
                            <Card.Body className="text-center">
                                <h3 className="text-warning fw-bold mb-1">
                                    {stats.platformFee.toLocaleString('vi-VN')}₫
                                </h3>
                                <p className="text-white mb-0">Phí nền tảng (15%)</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Filters */}
                <Row className="mb-4">
                    <Col md={6}>
                        <InputGroup className="search-input">
                            <InputGroup.Text className="bg-dark text-light border-secondary">
                                <FaSearch />
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Tìm kiếm theo mã giao dịch, tên người mua, môn học..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-dark text-light border-secondary"
                            />
                        </InputGroup>
                    </Col>
                    <Col md={3}>
                        <InputGroup>
                            <InputGroup.Text className="bg-dark text-light border-secondary">
                                <FaFilter />
                            </InputGroup.Text>
                            <Form.Select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-dark text-light border-secondary"
                            >
                                <option value="All">Tất cả trạng thái</option>
                                <option value="PENDING">Chờ thanh toán</option>
                                <option value="SUCCESS">Thành công</option>
                                <option value="FAILED">Thất bại</option>
                                <option value="CANCELLED">Đã hủy</option>
                            </Form.Select>
                        </InputGroup>
                    </Col>
                    <Col md={3} className="text-end">
                        <Button variant="outline-light" className="btn-export">
                            <FaDownload className="me-2" />
                            Xuất báo cáo
                        </Button>
                    </Col>
                </Row>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                        <p className="text-light mt-2">Đang tải dữ liệu đơn hàng...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {/* Orders Table */}
                {!loading && !error && (
                    <Card className="table-card bg-dark border-0">
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table hover className="orders-table mb-0">
                                    <thead>
                                        <tr>
                                            <th>Mã giao dịch</th>
                                            <th>Khách hàng</th>
                                            <th>Môn học</th>
                                            <th>Seller</th>
                                            <th>Số tiền</th>
                                            <th>Phí PT</th>
                                            <th>Seller nhận</th>
                                            <th>Trạng thái</th>
                                            <th>Ngày tạo</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="fw-semibold text-light">
                                                    #{order.transactionNo}
                                                </td>
                                                <td>
                                                    <div className="fw-semibold text-light">
                                                        {order.buyer?.name}
                                                    </div>
                                                    <small className="text-muted">
                                                        {order.buyer?.email}
                                                    </small>
                                                </td>
                                                <td className="text-light">{order.subject?.name}</td>
                                                <td className="text-light">{order.seller?.name}</td>
                                                <td className="text-success fw-semibold">
                                                    {order.amount?.toLocaleString('vi-VN')}₫
                                                </td>
                                                <td className="text-warning">
                                                    {(order.amount * 0.15).toLocaleString('vi-VN')}₫
                                                </td>
                                                <td className="text-info">
                                                    {calculateSellerReceive(order.amount).toLocaleString('vi-VN')}₫
                                                </td>
                                                <td>{getStatusBadge(order.status)}</td>
                                                <td className="text-light">
                                                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="outline-light"
                                                        size="sm"
                                                        onClick={() => handleViewDetails(order)}
                                                    >
                                                        <FaEye />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>

                            {filteredOrders.length === 0 && (
                                <p className="text-center text-secondary py-4">
                                    Không tìm thấy đơn hàng nào.
                                </p>
                            )}
                        </Card.Body>
                    </Card>
                )}

                {/* Order Detail Modal */}
                <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
                    <Modal.Header closeButton className="bg-dark text-white border-secondary">
                        <Modal.Title>Chi Tiết Đơn Hàng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-dark text-white">
                        {selectedOrder && (
                            <Row>
                                <Col md={6}>
                                    <h6 className="text-light mb-3">Thông Tin Đơn Hàng</h6>
                                    <div className="mb-2">
                                        <strong>Mã giao dịch:</strong> #{selectedOrder.transactionNo}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Khách hàng:</strong> {selectedOrder.buyer?.name}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Email:</strong> {selectedOrder.buyer?.email}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Môn học:</strong> {selectedOrder.subject?.name}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Seller:</strong> {selectedOrder.seller?.name}
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <h6 className="text-light mb-3">Thông Tin Thanh Toán</h6>
                                    <div className="mb-2">
                                        <strong>Tổng tiền:</strong>{' '}
                                        <span className="text-success">
                                            {selectedOrder.amount?.toLocaleString('vi-VN')}₫
                                        </span>
                                    </div>
                                    <div className="mb-2">
                                        <strong>Phí nền tảng (15%):</strong>{' '}
                                        <span className="text-warning">
                                            {(selectedOrder.amount * 0.15).toLocaleString('vi-VN')}₫
                                        </span>
                                    </div>
                                    <div className="mb-2">
                                        <strong>Seller nhận:</strong>{' '}
                                        <span className="text-info">
                                            {calculateSellerReceive(selectedOrder.amount).toLocaleString('vi-VN')}₫
                                        </span>
                                    </div>
                                    <div className="mb-2">
                                        <strong>Phương thức:</strong> {selectedOrder.paymentMethod}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Trạng thái:</strong>{' '}
                                        {getStatusBadge(selectedOrder.status)}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Thời gian thanh toán:</strong>{' '}
                                        {selectedOrder.paymentTime ? formatPaymentTime(selectedOrder.paymentTime) : 'N/A'}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Ngày tạo:</strong>{' '}
                                        {selectedOrder.createdAt}
                                    </div>
                                </Col>
                            </Row>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="bg-dark border-secondary">
                        <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                            Đóng
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default AdminOrdersPage;
