import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Dropdown, Form, Pagination } from "react-bootstrap";
import { FaUser, FaCalendarAlt, FaMoneyBillWave, FaFilter } from "react-icons/fa";
import "./SellerOrders.scss";
import { useSelector } from "react-redux";
import { getOrderOfSeller } from "../../services/apiService";
const SellerOrders = () => {
    const [filter, setFilter] = useState("All");
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        pages: 1,
        total: 0
    });
    const seller = useSelector((state) => state.user.account);

    // Filter by status
    const statusFilteredOrders = filter === "All"
        ? orders
        : orders.filter((order) => order.status === filter);

    // Filter by search term
    const filteredOrders = statusFilteredOrders.filter((order) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            order.subject?.name?.toLowerCase().includes(searchLower) ||
            order.buyer?.name?.toLowerCase().includes(searchLower)
        );
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getOrderOfSeller(seller.id, pagination.page - 1, pagination.pageSize);

                // Handle the API response - backend returns nested structure
                if (response && response.data) {
                    const ordersData = Array.isArray(response.data.result) ? response.data.result : [];
                    setOrders(ordersData);
                    setPagination({
                        page: response.data.meta.page,
                        pageSize: response.data.meta.pageSize,
                        pages: response.data.meta.pages,
                        total: response.data.meta.total
                    });
                } else {
                    setOrders([]);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError("Lỗi khi tải đơn hàng. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        if (seller?.id) {
            fetchOrders();
        }
    }, [seller?.id, pagination.page, pagination.pageSize]);

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="seller-orders">
            <div fluid="sm">
                <h3 className="fw-bold mb-2 text-gradient">Đơn hàng</h3>
                <p className="text-secondary mb-4">
                    Quản lý và theo dõi tất cả các đơn hàng của bộ đề thi của bạn.
                </p>

                {/* FILTER BAR */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                    <div className="btn-group" role="group">
                        {["All", "SUCCESS", "FAILED"].map((tab) => (
                            <Button
                                key={tab}
                                variant={filter === tab ? "gradient-active" : "outline-light"}
                                className={filter === tab ? "active" : ""}
                                onClick={() => setFilter(tab)}
                            >
                                {tab === "All" ? "All" : tab === "SUCCESS" ? "Success" : tab === "FAILED" ? "Failed" : ""}
                            </Button>
                        ))}
                    </div>

                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm theo người mua hoặc tiêu đề quiz..."
                        className="search-box bg-dark text-light border-secondary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* LOADING STATE */}
                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-secondary mt-2">Đang tải đơn hàng...</p>
                    </div>
                )}

                {/* ERROR STATE */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {/* ORDER LIST */}
                {!loading && !error && (
                    <>
                        <Row className="g-3">
                            {filteredOrders.map((order) => (
                                <Col xs={12} key={order.id}>
                                    <Card className="order-item p-3 bg-dark border-0 shadow-sm">
                                        <Row className="align-items-center g-3">
                                            <Col xs={12} md={4}>
                                                <h6 className="fw-semibold text-white mb-1">{order.subject?.name}</h6>
                                                <p className="small text-secondary mb-1">
                                                    <FaUser className="me-2 text-muted" />
                                                    {order.buyer?.name}
                                                </p>
                                            </Col>
                                            <Col xs={6} md={3}>
                                                <p className="small text-white-50 mb-1">
                                                    <FaCalendarAlt className="me-2 text-muted" />
                                                    {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                                                        year: "numeric",
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    })}
                                                </p>
                                            </Col>
                                            <Col xs={6} md={2}>
                                                <p className="small fw-semibold text-white">
                                                    <FaMoneyBillWave className="me-1 text-success" />
                                                    {order.amount?.toLocaleString("vi-VN")}₫
                                                </p>
                                            </Col>
                                            <Col xs={12} md={3} className="text-md-end">
                                                <Badge
                                                    bg={
                                                        order.status === "SUCCESS"
                                                            ? "success"
                                                            : order.status === "Pending"
                                                                ? "warning"
                                                                : "danger"
                                                    }
                                                    className="me-2"
                                                >
                                                    {order.status}
                                                </Badge>
                                                <Dropdown align="end">
                                                    <Dropdown.Toggle
                                                        size="sm"
                                                        variant="outline-light"
                                                        id={`dropdown-${order.id}`}
                                                    >
                                                        Hành động
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu variant="dark">
                                                        <Dropdown.Item>Xem chi tiết</Dropdown.Item>
                                                        <Dropdown.Item>Tải hóa đơn</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            ))}

                            {filteredOrders.length === 0 && (
                                <p className="text-center text-secondary mt-4">
                                    Không tìm thấy đơn hàng nào cho bộ lọc này.
                                </p>
                            )}
                        </Row>

                        {/* PAGINATION INFO */}
                        {pagination.total > 0 && (
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 gap-3">
                                <p className="text-secondary mb-0">
                                    Hiển thị {((pagination.page - 1) * pagination.pageSize) + 1} - {Math.min(pagination.page * pagination.pageSize, pagination.total)} trong tổng số {pagination.total} đơn hàng
                                </p>

                                <Pagination className="mb-0">
                                    <Pagination.First
                                        onClick={() => handlePageChange(1)}
                                        disabled={pagination.page === 1}
                                    />
                                    <Pagination.Prev
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                    />

                                    {[...Array(pagination.pages)].map((_, index) => {
                                        const pageNum = index + 1;
                                        // Show first page, last page, current page, and adjacent pages
                                        if (
                                            pageNum === 1 ||
                                            pageNum === pagination.pages ||
                                            (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                                        ) {
                                            return (
                                                <Pagination.Item
                                                    key={pageNum}
                                                    active={pageNum === pagination.page}
                                                    onClick={() => handlePageChange(pageNum)}
                                                >
                                                    {pageNum}
                                                </Pagination.Item>
                                            );
                                        } else if (
                                            pageNum === pagination.page - 2 ||
                                            pageNum === pagination.page + 2
                                        ) {
                                            return <Pagination.Ellipsis key={pageNum} disabled />;
                                        }
                                        return null;
                                    })}

                                    <Pagination.Next
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page === pagination.pages}
                                    />
                                    <Pagination.Last
                                        onClick={() => handlePageChange(pagination.pages)}
                                        disabled={pagination.page === pagination.pages}
                                    />
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default SellerOrders;
