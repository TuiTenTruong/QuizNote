import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Dropdown, Form } from "react-bootstrap";
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
        pageSize: 20,
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
            order.subjectName?.toLowerCase().includes(searchLower) ||
            order.buyerName?.toLowerCase().includes(searchLower)
        );
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getOrderOfSeller(seller.id);

                // Handle the new API response structure
                if (response.data) {
                    setOrders(response.data.result || []);
                    setPagination(response.data.meta || {
                        page: 1,
                        pageSize: 20,
                        pages: 1,
                        total: 0
                    });
                } else {
                    setOrders([]);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError("Failed to load orders. Please try again later.");
            } finally {
                setLoading(false);
            }
        };


        if (seller?.id) {
            fetchOrders();
        }
    }, [seller?.id]);
    console.log("Orders:", orders);
    return (
        <div className="seller-orders">
            <div fluid="sm">
                <h3 className="fw-bold mb-2 text-gradient">Orders</h3>
                <p className="text-secondary mb-4">
                    Manage and track all orders of your quiz sets.
                </p>

                {/* FILTER BAR */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                    <div className="btn-group" role="group">
                        {["All", "Completed", "Pending", "Cancelled"].map((tab) => (
                            <Button
                                key={tab}
                                variant={filter === tab ? "gradient-active" : "outline-light"}
                                onClick={() => setFilter(tab)}
                            >
                                {tab}
                            </Button>
                        ))}
                    </div>

                    <Form.Control
                        type="text"
                        placeholder="Search by buyer or quiz title..."
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
                        <p className="text-secondary mt-2">Loading orders...</p>
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
                                <Col xs={12} key={order.purchaseId}>
                                    <Card className="order-item p-3 bg-dark border-0 shadow-sm">
                                        <Row className="align-items-center g-3">
                                            <Col xs={12} md={4}>
                                                <h6 className="fw-semibold text-white mb-1">{order.subjectName}</h6>
                                                <p className="small text-secondary mb-1">
                                                    <FaUser className="me-2 text-muted" />
                                                    {order.buyerName}
                                                </p>
                                            </Col>
                                            <Col xs={6} md={3}>
                                                <p className="small text-white-50 mb-1">
                                                    <FaCalendarAlt className="me-2 text-muted" />
                                                    {new Date(order.purchasedAt).toLocaleDateString("vi-VN", {
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
                                                    {order.price.toLocaleString("vi-VN")}₫
                                                </p>
                                            </Col>
                                            <Col xs={12} md={3} className="text-md-end">
                                                <Badge
                                                    bg={
                                                        order.status === "Completed"
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
                                                        id={`dropdown-${order.purchaseId}`}
                                                    >
                                                        Actions
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu variant="dark">
                                                        <Dropdown.Item>View Details</Dropdown.Item>
                                                        <Dropdown.Item>Download Invoice</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            ))}

                            {filteredOrders.length === 0 && (
                                <p className="text-center text-secondary mt-4">
                                    No orders found for this filter.
                                </p>
                            )}
                        </Row>

                        {/* PAGINATION INFO */}
                        {pagination.total > 0 && (
                            <div className="d-flex justify-content-between align-items-center mt-4">
                                <p className="text-secondary mb-0">
                                    Showing {filteredOrders.length} of {pagination.total} orders
                                </p>
                                <p className="text-secondary mb-0">
                                    Page {pagination.page} of {pagination.pages}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default SellerOrders;
