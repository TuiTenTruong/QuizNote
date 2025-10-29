import { useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Dropdown, Form } from "react-bootstrap";
import { FaUser, FaCalendarAlt, FaMoneyBillWave, FaFilter } from "react-icons/fa";
import "./SellerOrders.scss";

const orders = [
    {
        id: "#ORD-001",
        buyer: "Nguyễn Minh Khoa",
        quizTitle: "Biology Fundamentals",
        date: "2025-10-17",
        amount: 49000,
        status: "Completed",
    },
    {
        id: "#ORD-002",
        buyer: "Trần Hồng Anh",
        quizTitle: "Advanced Chemistry",
        date: "2025-10-16",
        amount: 69000,
        status: "Pending",
    },
    {
        id: "#ORD-003",
        buyer: "Lê Đức Long",
        quizTitle: "Mathematics Practice Set",
        date: "2025-10-14",
        amount: 59000,
        status: "Cancelled",
    },
    {
        id: "#ORD-004",
        buyer: "Phạm Ngọc Hiếu",
        quizTitle: "Physics Master Test",
        date: "2025-10-12",
        amount: 75000,
        status: "Completed",
    },
];

function SellerOrders() {
    const [filter, setFilter] = useState("All");

    const filteredOrders =
        filter === "All"
            ? orders
            : orders.filter((order) => order.status === filter);

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
                    />
                </div>

                {/* ORDER LIST */}
                <Row className="g-3">
                    {filteredOrders.map((order) => (
                        <Col xs={12} key={order.id}>
                            <Card className="order-item p-3 bg-dark border-0 shadow-sm">
                                <Row className="align-items-center g-3">
                                    <Col xs={12} md={4}>
                                        <h6 className="fw-semibold text-white mb-1">{order.quizTitle}</h6>
                                        <p className="small text-secondary mb-1">
                                            <FaUser className="me-2 text-muted" />
                                            {order.buyer}
                                        </p>
                                    </Col>
                                    <Col xs={6} md={3}>
                                        <p className="small text-white-50 mb-1">
                                            <FaCalendarAlt className="me-2 text-muted" />
                                            {order.date}
                                        </p>
                                    </Col>
                                    <Col xs={6} md={2}>
                                        <p className="small fw-semibold text-white">
                                            <FaMoneyBillWave className="me-1 text-success" />
                                            {order.amount.toLocaleString("vi-VN")}₫
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
                                                id={`dropdown-${order.id}`}
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
            </div>
        </div>
    );
}

export default SellerOrders;
