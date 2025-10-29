import { useState } from "react";
import { Row, Col, Card, Button, Badge, Form, Table } from "react-bootstrap";
import { FaWallet, FaArrowUp, FaMoneyBillWave, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import "./SellerWallet.scss";

const withdrawals = [
    {
        id: "#WD-101",
        date: "2025-10-15",
        amount: 250000,
        method: "Bank Transfer",
        status: "Completed",
    },
    {
        id: "#WD-102",
        date: "2025-10-10",
        amount: 150000,
        method: "Momo Wallet",
        status: "Pending",
    },
    {
        id: "#WD-103",
        date: "2025-09-29",
        amount: 200000,
        method: "Bank Transfer",
        status: "Failed",
    },
];

function SellerWallet() {
    const [balance] = useState(1320000);
    const [inputAmount, setInputAmount] = useState("");
    const [method, setMethod] = useState("Bank Transfer");

    return (
        <div className="seller-wallet">
            <div fluid="sm">
                <h3 className="fw-bold mb-2 text-gradient">Wallet</h3>
                <p className="text-secondary mb-4">
                    View your earnings, manage payouts, and request withdrawals.
                </p>

                {/* SUMMARY CARDS */}
                <Row className="g-3 mb-4">
                    <Col xs={12} md={4}>
                        <Card className="wallet-card p-4 text-center bg-dark border-0 shadow-sm">
                            <FaWallet className="icon text-gradient mb-2" />
                            <h5 className="fw-bold text-white mb-1">
                                {balance.toLocaleString("vi-VN")} ₫
                            </h5>
                            <p className="text-secondary small mb-0">Available Balance</p>
                        </Card>
                    </Col>
                    <Col xs={12} md={4}>
                        <Card className="wallet-card p-4 text-center bg-dark border-0 shadow-sm">
                            <FaMoneyBillWave className="icon text-success mb-2" />
                            <h5 className="fw-bold text-white mb-1">420,000 ₫</h5>
                            <p className="text-secondary small mb-0">Earnings This Month</p>
                        </Card>
                    </Col>
                    <Col xs={12} md={4}>
                        <Card className="wallet-card p-4 text-center bg-dark border-0 shadow-sm">
                            <FaClock className="icon text-warning mb-2" />
                            <h5 className="fw-bold text-white mb-1">150,000 ₫</h5>
                            <p className="text-secondary small mb-0">Pending Payouts</p>
                        </Card>
                    </Col>
                </Row>

                {/* WITHDRAW SECTION */}
                <Card className="bg-dark border-0 p-4 mb-4 shadow-sm">
                    <h5 className="fw-semibold text-white mb-3">Request Withdrawal</h5>
                    <Form className="row g-3 align-items-end">
                        <Col xs={12} md={6}>
                            <Form.Group>
                                <Form.Label className="text-light">Amount (₫)</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter amount to withdraw"
                                    value={inputAmount}
                                    onChange={(e) => setInputAmount(e.target.value)}
                                    className="bg-dark text-light border-secondary"
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={4}>
                            <Form.Group>
                                <Form.Label className="text-light">Method</Form.Label>
                                <Form.Select
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                    className="bg-dark text-light border-secondary"
                                >
                                    <option>Bank Transfer</option>
                                    <option>Momo Wallet</option>
                                    <option>ZaloPay</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={2} className="d-grid">
                            <Button className="btn-gradient py-2 fw-semibold">
                                <FaArrowUp className="me-2" /> Withdraw
                            </Button>
                        </Col>
                    </Form>
                </Card>

                {/* WITHDRAWAL HISTORY */}
                <Card className="bg-dark border-0 p-4 shadow-sm">
                    <h5 className="fw-semibold text-white mb-3">Withdrawal History</h5>
                    <div className="table-responsive">
                        <Table hover borderless variant="dark" className="align-middle">
                            <thead>
                                <tr className="text-secondary small">
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {withdrawals.map((wd) => (
                                    <tr key={wd.id}>
                                        <td>{wd.id}</td>
                                        <td>{wd.date}</td>
                                        <td>{wd.amount.toLocaleString("vi-VN")} ₫</td>
                                        <td>{wd.method}</td>
                                        <td>
                                            <Badge
                                                bg={
                                                    wd.status === "Completed"
                                                        ? "success"
                                                        : wd.status === "Pending"
                                                            ? "warning"
                                                            : "danger"
                                                }
                                                text={wd.status === "Pending" ? "dark" : undefined}
                                            >
                                                {wd.status === "Completed" && (
                                                    <FaCheckCircle className="me-1" />
                                                )}
                                                {wd.status === "Pending" && (
                                                    <FaClock className="me-1" />
                                                )}
                                                {wd.status === "Failed" && (
                                                    <FaTimesCircle className="me-1" />
                                                )}
                                                {wd.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default SellerWallet;
