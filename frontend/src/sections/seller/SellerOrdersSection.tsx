import { useEffect, useState } from "react";
import { Row, Col, Card, Button, Badge, Dropdown, Form, Pagination } from "react-bootstrap";
import { FaUser, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useSellerOrdersQuery } from "../../hooks/useOrder";
import styles from "./scss/SellerOrders.module.scss";

const SellerOrdersSection = () => {
    const [filter, setFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, pages: 1, total: 0 });
    const seller = useSelector((state: any) => state.user.account);
    const { orders, meta, loading, error } = useSellerOrdersQuery(seller?.id, pagination.page, pagination.pageSize);

    useEffect(() => {
        setPagination((prev) => ({ ...prev, ...meta }));
    }, [meta]);

    const statusFilteredOrders = filter === "All" ? orders : orders.filter((order) => order.status === filter);
    const filteredOrders = statusFilteredOrders.filter((order) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            order.subject?.name?.toLowerCase().includes(searchLower) ||
            order.buyer?.name?.toLowerCase().includes(searchLower)
        );
    });

    const handlePageChange = (newPage: number) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className={styles.sellerOrders}>
            <h3 className="fw-bold mb-2 text-gradient">Don hang</h3>
            <p className="text-secondary mb-4">Quan ly va theo doi tat ca don hang cua ban.</p>

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div className="btn-group" role="group">
                    {["All", "SUCCESS", "FAILED"].map((tab) => (
                        <Button
                            key={tab}
                            variant={filter === tab ? "gradient-active" : "outline-light"}
                            className={filter === tab ? "active" : ""}
                            onClick={() => setFilter(tab)}
                        >
                            {tab}
                        </Button>
                    ))}
                </div>

                <Form.Control
                    type="text"
                    placeholder="Tim theo nguoi mua hoac tieu de quiz..."
                    className="search-box bg-dark text-light border-secondary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading && <p className="text-center text-secondary mt-2">Dang tai don hang...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

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
                                                <FaUser className="me-2 text-muted" /> {order.buyer?.name}
                                            </p>
                                        </Col>
                                        <Col xs={6} md={3}>
                                            <p className="small text-white-50 mb-1">
                                                <FaCalendarAlt className="me-2 text-muted" />
                                                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                                            </p>
                                        </Col>
                                        <Col xs={6} md={2}>
                                            <p className="small fw-semibold text-white">
                                                <FaMoneyBillWave className="me-1 text-success" />
                                                {order.amount?.toLocaleString("vi-VN")} VND
                                            </p>
                                        </Col>
                                        <Col xs={12} md={3} className="text-md-end">
                                            <Badge bg={order.status === "SUCCESS" ? "success" : "danger"} className="me-2">
                                                {order.status}
                                            </Badge>
                                            <Dropdown align="end">
                                                <Dropdown.Toggle size="sm" variant="outline-light" id={`dropdown-${order.id}`}>
                                                    Hanh dong
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu variant="dark">
                                                    <Dropdown.Item>Xem chi tiet</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {pagination.total > 0 && (
                        <div className="d-flex justify-content-end mt-4">
                            <Pagination className="mb-0">
                                <Pagination.Prev onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1} />
                                {[...Array(pagination.pages)].map((_, index) => {
                                    const pageNum = index + 1;
                                    return (
                                        <Pagination.Item
                                            key={pageNum}
                                            active={pageNum === pagination.page}
                                            onClick={() => handlePageChange(pageNum)}
                                        >
                                            {pageNum}
                                        </Pagination.Item>
                                    );
                                })}
                                <Pagination.Next
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.pages}
                                />
                            </Pagination>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SellerOrdersSection;
